import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../models/movie.dart';
import '../theme.dart';
import '../utils/translations.dart';

class MovieCard extends StatelessWidget {
  const MovieCard({super.key, required this.movie});

  final Movie movie;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Poster image
          Positioned.fill(
            child: CachedNetworkImage(
              imageUrl: movie.poster,
              fit: BoxFit.cover,
              placeholder: (_, __) => Container(
                color: AppColors.surface,
                child: const Center(
                  child: Icon(Icons.movie_outlined,
                      size: 64, color: AppColors.secondaryText),
                ),
              ),
              errorWidget: (_, __, ___) => Container(
                color: AppColors.surface,
                child: const Center(
                  child: Icon(Icons.broken_image_outlined,
                      size: 64, color: AppColors.secondaryText),
                ),
              ),
            ),
          ),
          // Bottom gradient overlay
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    Colors.black.withOpacity(0.95),
                    Colors.black.withOpacity(0.7),
                    Colors.transparent,
                  ],
                  stops: const [0.0, 0.5, 1.0],
                ),
              ),
              padding: const EdgeInsets.fromLTRB(16, 48, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    movie.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded,
                          color: Color(0xFFFFD700), size: 16),
                      const SizedBox(width: 4),
                      Text(
                        movie.ratingFormatted,
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '${movie.year}',
                        style: const TextStyle(color: AppColors.secondaryText),
                      ),
                      const SizedBox(width: 12),
                      const Icon(Icons.schedule,
                          size: 14, color: AppColors.secondaryText),
                      const SizedBox(width: 4),
                      Text(
                        movie.durationFormatted,
                        style:
                            const TextStyle(color: AppColors.secondaryText),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: movie.genres
                        .take(3)
                        .map((g) => _GenreChip(label: genreLabel(g)))
                        .toList(),
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

class _GenreChip extends StatelessWidget {
  const _GenreChip({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Colors.white, fontSize: 11),
      ),
    );
  }
}

// Small card for grid/list use
class MovieListTile extends StatelessWidget {
  const MovieListTile({
    super.key,
    required this.movie,
    this.onTap,
    this.trailing,
  });

  final Movie movie;
  final VoidCallback? onTap;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: CachedNetworkImage(
                imageUrl: movie.poster,
                width: 56,
                height: 80,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(
                  width: 56,
                  height: 80,
                  color: AppColors.surface,
                  child: const Icon(Icons.movie_outlined,
                      color: AppColors.secondaryText),
                ),
                errorWidget: (_, __, ___) => Container(
                  width: 56,
                  height: 80,
                  color: AppColors.surface,
                  child: const Icon(Icons.broken_image_outlined,
                      color: AppColors.secondaryText),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    movie.title,
                    style: const TextStyle(
                      color: AppColors.primaryText,
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded,
                          color: Color(0xFFFFD700), size: 14),
                      const SizedBox(width: 3),
                      Text(movie.ratingFormatted,
                          style: const TextStyle(
                              color: AppColors.secondaryText, fontSize: 13)),
                      const SizedBox(width: 8),
                      Text('${movie.year}',
                          style: const TextStyle(
                              color: AppColors.secondaryText, fontSize: 13)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    movie.genres.take(2).map(genreLabel).join(' · '),
                    style: const TextStyle(
                        color: AppColors.secondaryText, fontSize: 12),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            if (trailing != null) trailing!,
          ],
        ),
      ),
    );
  }
}
