import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/movie_repository.dart';
import '../models/movie.dart';

// Injected in main.dart via overrideWithValue
final movieRepositoryProvider = Provider<MovieRepository>((ref) {
  throw UnimplementedError('movieRepositoryProvider must be overridden');
});

// ── Swipe Stack ─────────────────────────────────────────────────────────────

class SwipeStackNotifier extends StateNotifier<List<Movie>> {
  SwipeStackNotifier(List<Movie> initial) : super(initial);

  Movie? _lastRemoved;
  bool _lastWasLike = false;

  bool get canUndo => _lastRemoved != null;
  bool get lastWasLike => _lastWasLike;
  Movie? get lastRemoved => _lastRemoved;

  void removeTop(bool liked) {
    if (state.isEmpty) return;
    _lastRemoved = state.first;
    _lastWasLike = liked;
    state = state.skip(1).toList();
  }

  void undo() {
    if (_lastRemoved == null) return;
    state = [_lastRemoved!, ...state];
    _lastRemoved = null;
  }

  void reload(MovieRepository repo) {
    state = repo.getShuffledStack();
    _lastRemoved = null;
  }
}

final swipeStackProvider =
    StateNotifierProvider<SwipeStackNotifier, List<Movie>>((ref) {
  final repo = ref.watch(movieRepositoryProvider);
  return SwipeStackNotifier(repo.getShuffledStack());
});

// ── Favorites ────────────────────────────────────────────────────────────────

class FavoritesNotifier extends StateNotifier<List<Movie>> {
  FavoritesNotifier(this._repo) : super(_repo.getFavorites());

  final MovieRepository _repo;

  Future<void> toggle(String id) async {
    await _repo.toggleFavorite(id);
    state = _repo.getFavorites();
  }

  bool isFavorite(String id) => state.any((m) => m.id == id);
}

final favoritesProvider =
    StateNotifierProvider<FavoritesNotifier, List<Movie>>((ref) {
  final repo = ref.watch(movieRepositoryProvider);
  return FavoritesNotifier(repo);
});

// ── Mood Selection ───────────────────────────────────────────────────────────

final selectedMoodsProvider = StateProvider<List<String>>((ref) => []);

// ── Catalog Search ───────────────────────────────────────────────────────────

final searchQueryProvider = StateProvider<String>((ref) => '');
final selectedGenresProvider = StateProvider<List<String>>((ref) => []);

final catalogMoviesProvider = Provider<List<Movie>>((ref) {
  final repo = ref.watch(movieRepositoryProvider);
  final query = ref.watch(searchQueryProvider);
  final genres = ref.watch(selectedGenresProvider);
  return repo.search(query, genres: genres);
});
