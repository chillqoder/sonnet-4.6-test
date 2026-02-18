import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../theme.dart';
import '../widgets/movie_card.dart';
import 'movie_details_screen.dart';

class FavoritesScreen extends ConsumerWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favorites = ref.watch(favoritesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Избранное')),
      body: favorites.isEmpty
          ? const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.favorite_border,
                      size: 72, color: AppColors.secondaryText),
                  SizedBox(height: 16),
                  Text(
                    'Нет избранных фильмов',
                    style: TextStyle(
                        color: AppColors.primaryText,
                        fontSize: 18,
                        fontWeight: FontWeight.w600),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Смахните вправо, чтобы добавить',
                    style: TextStyle(
                        color: AppColors.secondaryText, fontSize: 14),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: favorites.length,
              itemBuilder: (context, index) {
                final movie = favorites[index];
                return MovieListTile(
                  movie: movie,
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute(
                        builder: (_) => MovieDetailsScreen(movie: movie)),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.favorite,
                        color: AppColors.like),
                    onPressed: () =>
                        ref.read(favoritesProvider.notifier).toggle(movie.id),
                  ),
                );
              },
            ),
    );
  }
}
