import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../theme.dart';
import '../utils/translations.dart';
import '../widgets/movie_card.dart';
import 'movie_details_screen.dart';

const _allGenres = [
  'action', 'adventure', 'animation', 'biography', 'comedy',
  'crime', 'drama', 'family', 'fantasy', 'history',
  'horror', 'music', 'mystery', 'romance', 'sci-fi',
  'thriller', 'war', 'western',
];

class CatalogScreen extends ConsumerWidget {
  const CatalogScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final movies = ref.watch(catalogMoviesProvider);
    final selectedGenres = ref.watch(selectedGenresProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Каталог'),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.filter_list_rounded),
                if (selectedGenres.isNotEmpty)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.accent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () => _showGenreFilter(context, ref, selectedGenres),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: TextField(
              onChanged: (v) =>
                  ref.read(searchQueryProvider.notifier).state = v,
              decoration: const InputDecoration(
                hintText: 'Поиск фильмов...',
                prefixIcon: Icon(Icons.search, color: AppColors.secondaryText),
              ),
              style: const TextStyle(color: AppColors.primaryText),
            ),
          ),
          if (selectedGenres.isNotEmpty)
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: selectedGenres
                    .map((g) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: Chip(
                            label: Text(genreLabel(g)),
                            deleteIcon: const Icon(Icons.close, size: 16),
                            onDeleted: () {
                              final current = List<String>.from(
                                  ref.read(selectedGenresProvider));
                              current.remove(g);
                              ref
                                  .read(selectedGenresProvider.notifier)
                                  .state = current;
                            },
                            backgroundColor:
                                AppColors.accent.withOpacity(0.15),
                            labelStyle: const TextStyle(
                                color: AppColors.accent, fontSize: 12),
                            deleteIconColor: AppColors.accent,
                            side: const BorderSide(
                                color: AppColors.accent, width: 1),
                            visualDensity: VisualDensity.compact,
                          ),
                        ))
                    .toList(),
              ),
            ),
          Expanded(
            child: movies.isEmpty
                ? const Center(
                    child: Text('Ничего не найдено',
                        style: TextStyle(color: AppColors.secondaryText)),
                  )
                : ListView.builder(
                    itemCount: movies.length,
                    itemBuilder: (context, index) {
                      final movie = movies[index];
                      return MovieListTile(
                        movie: movie,
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                              builder: (_) =>
                                  MovieDetailsScreen(movie: movie)),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showGenreFilter(
      BuildContext context, WidgetRef ref, List<String> selected) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _GenreFilterSheet(selected: selected, ref: ref),
    );
  }
}

class _GenreFilterSheet extends StatelessWidget {
  const _GenreFilterSheet({required this.selected, required this.ref});

  final List<String> selected;
  final WidgetRef ref;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
          child: Row(
            children: [
              const Expanded(
                child: Text('Жанры',
                    style: TextStyle(
                        color: AppColors.primaryText,
                        fontSize: 18,
                        fontWeight: FontWeight.w600)),
              ),
              if (selected.isNotEmpty)
                TextButton(
                  onPressed: () {
                    ref.read(selectedGenresProvider.notifier).state = [];
                    Navigator.pop(context);
                  },
                  child: const Text('Сбросить',
                      style: TextStyle(color: AppColors.accent)),
                ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _allGenres.map((g) {
              final isSel = selected.contains(g);
              return GestureDetector(
                onTap: () {
                  final current = List<String>.from(
                      ref.read(selectedGenresProvider));
                  if (isSel) {
                    current.remove(g);
                  } else {
                    current.add(g);
                  }
                  ref.read(selectedGenresProvider.notifier).state = current;
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSel
                        ? AppColors.accent.withOpacity(0.15)
                        : AppColors.card,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSel ? AppColors.accent : Colors.transparent,
                      width: 1.5,
                    ),
                  ),
                  child: Text(
                    genreLabel(g),
                    style: TextStyle(
                      color:
                          isSel ? AppColors.accent : AppColors.primaryText,
                      fontSize: 13,
                      fontWeight: isSel
                          ? FontWeight.w600
                          : FontWeight.normal,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
