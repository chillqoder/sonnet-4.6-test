import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/movie.dart';

class MovieRepository {
  late List<Movie> _all;
  final Box _box = Hive.box('favorites');

  Future<void> init() async {
    final raw = await rootBundle.loadString('assets/movies.json');
    final list = json.decode(raw) as List;
    _all = list.map((e) => Movie.fromJson(e as Map<String, dynamic>)).toList();
    _applyFavorites();
  }

  void _applyFavorites() {
    final ids = Set<String>.from(
      _box.get('ids', defaultValue: <dynamic>[]) as List,
    );
    for (final m in _all) {
      m.isFavorite = ids.contains(m.id);
    }
  }

  List<Movie> getAll() => List.from(_all);

  List<Movie> getShuffledStack({int count = 20}) {
    final copy = List<Movie>.from(_all)..shuffle();
    return copy.take(count).toList();
  }

  List<Movie> getByMoods(List<String> moods) {
    if (moods.isEmpty) return List.from(_all);
    return _all
        .where((m) => m.moods.any((mood) => moods.contains(mood)))
        .toList();
  }

  Movie? getRandomByMoods(List<String> moods) {
    final filtered = getByMoods(moods)..shuffle();
    return filtered.isEmpty ? null : filtered.first;
  }

  List<Movie> search(String query, {List<String> genres = const []}) {
    var result = _all.where((m) {
      if (genres.isNotEmpty && !m.genres.any((g) => genres.contains(g))) {
        return false;
      }
      if (query.isEmpty) return true;
      final q = query.toLowerCase();
      return m.title.toLowerCase().contains(q) ||
          (m.originalTitle?.toLowerCase().contains(q) ?? false) ||
          m.director.toLowerCase().contains(q) ||
          m.cast.any((c) => c.toLowerCase().contains(q)) ||
          m.tags.any((t) => t.toLowerCase().contains(q));
    }).toList();
    return result;
  }

  List<Movie> getFavorites() => _all.where((m) => m.isFavorite).toList();

  Future<void> toggleFavorite(String id) async {
    final movie = _all.firstWhere((m) => m.id == id);
    movie.isFavorite = !movie.isFavorite;
    final ids = Set<String>.from(
      _box.get('ids', defaultValue: <dynamic>[]) as List,
    );
    if (movie.isFavorite) {
      ids.add(id);
    } else {
      ids.remove(id);
    }
    await _box.put('ids', ids.toList());
  }

  Movie? getById(String id) {
    try {
      return _all.firstWhere((m) => m.id == id);
    } catch (_) {
      return null;
    }
  }
}
