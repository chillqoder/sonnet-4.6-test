class Movie {
  final String id;
  final String title;
  final String? originalTitle;
  final int year;
  final String description;
  final List<String> genres;
  final List<String> moods;
  final double rating;
  final int duration;
  final String director;
  final List<String> cast;
  final String poster;
  final String backdrop;
  final String language;
  final List<String> tags;
  bool isFavorite;
  String watchStatus;
  final int? tmdbId;

  Movie({
    required this.id,
    required this.title,
    this.originalTitle,
    required this.year,
    required this.description,
    required this.genres,
    required this.moods,
    required this.rating,
    required this.duration,
    required this.director,
    required this.cast,
    required this.poster,
    required this.backdrop,
    required this.language,
    required this.tags,
    this.isFavorite = false,
    this.watchStatus = 'unwatched',
    this.tmdbId,
  });

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'] as String,
      title: json['title'] as String,
      originalTitle: json['original_title'] as String?,
      year: json['year'] as int,
      description: json['description'] as String,
      genres: List<String>.from(json['genres'] as List),
      moods: List<String>.from(json['moods'] as List),
      rating: (json['rating'] as num).toDouble(),
      duration: json['duration'] as int,
      director: json['director'] as String,
      cast: List<String>.from(json['cast'] as List),
      poster: json['poster'] as String,
      backdrop: json['backdrop'] as String,
      language: json['language'] as String,
      tags: List<String>.from(json['tags'] as List),
      isFavorite: json['is_favorite'] as bool? ?? false,
      watchStatus: json['watch_status'] as String? ?? 'unwatched',
      tmdbId: json['tmdb_id'] as int?,
    );
  }

  String get durationFormatted {
    final h = duration ~/ 60;
    final m = duration % 60;
    if (h == 0) return '${m}м';
    return '${h}ч ${m}м';
  }

  String get ratingFormatted => rating.toStringAsFixed(1);
}
