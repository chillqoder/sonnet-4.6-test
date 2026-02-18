import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/movie.dart';
import '../providers/providers.dart';
import '../theme.dart';
import '../utils/translations.dart';

class MovieDetailsScreen extends ConsumerWidget {
  const MovieDetailsScreen({super.key, required this.movie});

  final Movie movie;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favorites = ref.watch(favoritesProvider);
    final isFav = favorites.any((m) => m.id == movie.id);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppColors.surface,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: movie.backdrop.isNotEmpty
                        ? movie.backdrop
                        : movie.poster,
                    fit: BoxFit.cover,
                    placeholder: (_, __) =>
                        Container(color: AppColors.surface),
                    errorWidget: (_, __, ___) =>
                        Container(color: AppColors.surface),
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          AppColors.background.withOpacity(0.8),
                          AppColors.background,
                        ],
                        stops: const [0.4, 0.7, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              IconButton(
                icon: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: Icon(
                    isFav ? Icons.favorite : Icons.favorite_border,
                    key: ValueKey(isFav),
                    color: isFav ? AppColors.like : AppColors.primaryText,
                  ),
                ),
                onPressed: () =>
                    ref.read(favoritesProvider.notifier).toggle(movie.id),
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Poster + title row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: CachedNetworkImage(
                          imageUrl: movie.poster,
                          width: 100,
                          height: 150,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => Container(
                            width: 100,
                            height: 150,
                            color: AppColors.surface,
                          ),
                          errorWidget: (_, __, ___) => Container(
                            width: 100,
                            height: 150,
                            color: AppColors.surface,
                            child: const Icon(Icons.movie_outlined,
                                color: AppColors.secondaryText),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              movie.title,
                              style: const TextStyle(
                                color: AppColors.primaryText,
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                height: 1.2,
                              ),
                            ),
                            if (movie.originalTitle != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                movie.originalTitle!,
                                style: const TextStyle(
                                    color: AppColors.secondaryText,
                                    fontSize: 13),
                              ),
                            ],
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.star_rounded,
                                    color: Color(0xFFFFD700), size: 16),
                                const SizedBox(width: 4),
                                Text(
                                  movie.ratingFormatted,
                                  style: const TextStyle(
                                      color: AppColors.primaryText,
                                      fontWeight: FontWeight.w600),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  '${movie.year}',
                                  style: const TextStyle(
                                      color: AppColors.secondaryText),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  movie.durationFormatted,
                                  style: const TextStyle(
                                      color: AppColors.secondaryText),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Genres
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: movie.genres
                        .map((g) => _Chip(label: genreLabel(g)))
                        .toList(),
                  ),
                  const SizedBox(height: 20),

                  // Description
                  const Text('Описание',
                      style: TextStyle(
                          color: AppColors.primaryText,
                          fontSize: 16,
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Text(
                    movie.description,
                    style: const TextStyle(
                        color: AppColors.secondaryText,
                        fontSize: 14,
                        height: 1.6),
                  ),
                  const SizedBox(height: 20),

                  // Director
                  _InfoRow(label: 'Режиссёр', value: movie.director),
                  const SizedBox(height: 12),

                  // Cast
                  const Text('В ролях',
                      style: TextStyle(
                          color: AppColors.primaryText,
                          fontSize: 16,
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Text(
                    movie.cast.join(', '),
                    style: const TextStyle(
                        color: AppColors.secondaryText,
                        fontSize: 14,
                        height: 1.5),
                  ),
                  const SizedBox(height: 20),

                  // Moods
                  const Text('Настроение',
                      style: TextStyle(
                          color: AppColors.primaryText,
                          fontSize: 16,
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: movie.moods
                        .map((m) => _Chip(
                            label: moodLabel(m),
                            color: AppColors.accent.withOpacity(0.15),
                            textColor: AppColors.accent))
                        .toList(),
                  ),
                  const SizedBox(height: 24),

                  // Add to favorites button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: Icon(
                          isFav ? Icons.favorite : Icons.favorite_border),
                      label: Text(isFav
                          ? 'Убрать из избранного'
                          : 'Добавить в избранное'),
                      onPressed: () =>
                          ref.read(favoritesProvider.notifier).toggle(movie.id),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({
    required this.label,
    this.color,
    this.textColor,
  });

  final String label;
  final Color? color;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color ?? AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: textColor ?? AppColors.primaryText,
          fontSize: 13,
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 100,
          child: Text(label,
              style: const TextStyle(
                  color: AppColors.secondaryText, fontSize: 14)),
        ),
        Expanded(
          child: Text(value,
              style: const TextStyle(
                  color: AppColors.primaryText, fontSize: 14)),
        ),
      ],
    );
  }
}
