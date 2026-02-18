import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/movie.dart';
import '../providers/providers.dart';
import '../theme.dart';
import '../widgets/movie_card.dart';
import 'movie_details_screen.dart';

class SwipeScreen extends ConsumerStatefulWidget {
  const SwipeScreen({super.key});

  @override
  ConsumerState<SwipeScreen> createState() => _SwipeScreenState();
}

class _SwipeScreenState extends ConsumerState<SwipeScreen>
    with SingleTickerProviderStateMixin {
  Offset _offset = Offset.zero;
  bool _isAnimating = false;

  late AnimationController _animController;
  late Animation<Offset> _animation;
  bool? _swipeDir; // true = like, false = skip, null = snap back

  Movie? _lastSwiped;
  bool _lastWasLike = false;

  static const _swipeThreshold = 90.0;
  static const _velocityThreshold = 700.0;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 280),
    );
    _animController.addListener(() => setState(() {
          _offset = _animation.value;
        }));
    _animController.addStatusListener(_onAnimationStatus);
  }

  void _onAnimationStatus(AnimationStatus status) {
    if (status != AnimationStatus.completed) return;
    if (_swipeDir != null) {
      _finishSwipe(_swipeDir!);
    }
    setState(() {
      _offset = Offset.zero;
      _isAnimating = false;
      _swipeDir = null;
    });
  }

  void _finishSwipe(bool liked) {
    final movies = ref.read(swipeStackProvider);
    if (movies.isEmpty) return;
    final movie = movies.first;
    _lastSwiped = movie;
    _lastWasLike = liked;
    ref.read(swipeStackProvider.notifier).removeTop(liked);
    if (liked) {
      ref.read(favoritesProvider.notifier).toggle(movie.id);
    }
  }

  void _startAnim(Offset from, Offset to, bool? dir) {
    _swipeDir = dir;
    _isAnimating = true;
    _animation = Tween<Offset>(begin: from, end: to)
        .animate(CurvedAnimation(parent: _animController, curve: Curves.easeOut));
    _animController.forward(from: 0);
  }

  void _handlePanUpdate(DragUpdateDetails d) {
    if (_isAnimating) return;
    setState(() => _offset += d.delta);
  }

  void _handlePanEnd(DragEndDetails d) {
    if (_isAnimating) return;
    final vx = d.velocity.pixelsPerSecond.dx;
    if (_offset.dx.abs() > _swipeThreshold ||
        vx.abs() > _velocityThreshold) {
      final liked = _offset.dx > 0 || vx > 0;
      final targetX = liked ? 800.0 : -800.0;
      _startAnim(_offset, Offset(targetX, _offset.dy * 0.5), liked);
    } else {
      _startAnim(_offset, Offset.zero, null);
    }
  }

  void _swipe(bool liked) {
    if (_isAnimating) return;
    final movies = ref.read(swipeStackProvider);
    if (movies.isEmpty) return;
    final targetX = liked ? 800.0 : -800.0;
    _startAnim(_offset, Offset(targetX, 0), liked);
  }

  void _undo() {
    if (_lastSwiped == null) return;
    ref.read(swipeStackProvider.notifier).undo();
    if (_lastWasLike) {
      ref.read(favoritesProvider.notifier).toggle(_lastSwiped!.id);
    }
    _lastSwiped = null;
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final movies = ref.watch(swipeStackProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'MovieSwipe',
          style: TextStyle(
            color: AppColors.accent,
            fontWeight: FontWeight.w700,
            fontSize: 22,
          ),
        ),
        actions: [
          if (_lastSwiped != null)
            IconButton(
              icon: const Icon(Icons.undo_rounded),
              tooltip: 'Отменить',
              onPressed: _undo,
            ),
        ],
      ),
      body: movies.isEmpty
          ? _EmptyStack(onReload: () {
              final repo = ref.read(movieRepositoryProvider);
              ref.read(swipeStackProvider.notifier).reload(repo);
            })
          : Column(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                    child: _buildCardStack(movies),
                  ),
                ),
                _buildActionBar(),
              ],
            ),
    );
  }

  Widget _buildCardStack(List<Movie> movies) {
    return LayoutBuilder(builder: (context, constraints) {
      final cardSize = Size(constraints.maxWidth, constraints.maxHeight);

      return Stack(
        alignment: Alignment.center,
        children: [
          // Background cards (static, slightly scaled down)
          if (movies.length > 2)
            _buildBackCard(movies[2], 2, cardSize),
          if (movies.length > 1)
            _buildBackCard(movies[1], 1, cardSize),

          // Top card (draggable)
          _buildTopCard(movies[0], cardSize),
        ],
      );
    });
  }

  Widget _buildBackCard(Movie movie, int depth, Size size) {
    final scale = 1.0 - depth * 0.04;
    final yShift = depth * -10.0;
    return Transform.translate(
      offset: Offset(0, yShift),
      child: Transform.scale(
        scale: scale,
        alignment: Alignment.center,
        child: SizedBox(
          width: size.width,
          height: size.height,
          child: MovieCard(movie: movie),
        ),
      ),
    );
  }

  Widget _buildTopCard(Movie movie, Size size) {
    final rotation = _offset.dx / 1000;
    final likeOpacity = (_offset.dx / 80).clamp(0.0, 1.0);
    final nopeOpacity = (-_offset.dx / 80).clamp(0.0, 1.0);

    return GestureDetector(
      onPanUpdate: _isAnimating ? null : _handlePanUpdate,
      onPanEnd: _isAnimating ? null : _handlePanEnd,
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute(
            builder: (_) => MovieDetailsScreen(movie: movie)),
      ),
      child: Transform(
        transform: Matrix4.translationValues(_offset.dx, _offset.dy, 0)
          ..rotateZ(rotation),
        alignment: Alignment.bottomCenter,
        child: SizedBox(
          width: size.width,
          height: size.height,
          child: Stack(
            fit: StackFit.expand,
            children: [
              MovieCard(movie: movie),
              // LIKE overlay
              if (likeOpacity > 0.05)
                Positioned(
                  top: 24,
                  left: 24,
                  child: Opacity(
                    opacity: likeOpacity,
                    child: _SwipeLabel(label: 'ЛАЙК', color: AppColors.like),
                  ),
                ),
              // NOPE overlay
              if (nopeOpacity > 0.05)
                Positioned(
                  top: 24,
                  right: 24,
                  child: Opacity(
                    opacity: nopeOpacity,
                    child: _SwipeLabel(label: 'ПРОПУСК', color: AppColors.nope),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Dislike
          _ActionButton(
            icon: Icons.close_rounded,
            color: AppColors.nope,
            size: 56,
            onTap: () => _swipe(false),
          ),
          const SizedBox(width: 20),
          // Undo
          _ActionButton(
            icon: Icons.undo_rounded,
            color: AppColors.secondaryText,
            size: 44,
            onTap: _lastSwiped != null ? _undo : null,
          ),
          const SizedBox(width: 20),
          // Like
          _ActionButton(
            icon: Icons.favorite_rounded,
            color: AppColors.like,
            size: 56,
            onTap: () => _swipe(true),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.color,
    required this.size,
    this.onTap,
  });

  final IconData icon;
  final Color color;
  final double size;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final disabled = onTap == null;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.card,
          border: Border.all(
              color: disabled ? AppColors.surface : color.withOpacity(0.4),
              width: 2),
          boxShadow: disabled
              ? null
              : [
                  BoxShadow(
                    color: color.withOpacity(0.2),
                    blurRadius: 12,
                  )
                ],
        ),
        child: Icon(
          icon,
          color: disabled ? AppColors.secondaryText.withOpacity(0.4) : color,
          size: size * 0.44,
        ),
      ),
    );
  }
}

class _SwipeLabel extends StatelessWidget {
  const _SwipeLabel({required this.label, required this.color});
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        border: Border.all(color: color, width: 2.5),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
          fontSize: 18,
          letterSpacing: 1.5,
        ),
      ),
    );
  }
}

class _EmptyStack extends StatelessWidget {
  const _EmptyStack({required this.onReload});
  final VoidCallback onReload;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.movie_outlined,
              size: 80, color: AppColors.secondaryText),
          const SizedBox(height: 16),
          const Text(
            'Фильмы закончились',
            style: TextStyle(
                color: AppColors.primaryText,
                fontSize: 20,
                fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          const Text(
            'Загрузить новую подборку?',
            style:
                TextStyle(color: AppColors.secondaryText, fontSize: 14),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Обновить'),
            onPressed: onReload,
          ),
        ],
      ),
    );
  }
}
