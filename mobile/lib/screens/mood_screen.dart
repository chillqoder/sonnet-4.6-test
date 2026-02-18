import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/providers.dart';
import '../theme.dart';
import '../utils/translations.dart';
import 'movie_details_screen.dart';

const _allMoods = [
  'adventurous', 'contemplative', 'dark', 'disturbing', 'emotional',
  'epic', 'exciting', 'fun', 'funny', 'heartwarming',
  'inspiring', 'intense', 'irreverent', 'magical', 'mind-bending',
  'mysterious', 'nostalgic', 'powerful', 'psychological', 'reflective',
  'romantic', 'satirical', 'scary', 'stylish', 'tense',
  'thought-provoking', 'thrilling', 'unsettling', 'visual', 'wonderful',
];

class MoodScreen extends ConsumerWidget {
  const MoodScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selected = ref.watch(selectedMoodsProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('По настроению'),
        actions: [
          if (selected.isNotEmpty)
            TextButton(
              onPressed: () =>
                  ref.read(selectedMoodsProvider.notifier).state = [],
              child: const Text('Сбросить',
                  style: TextStyle(color: AppColors.secondaryText)),
            ),
        ],
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Text(
              'Выберите настроение',
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 4),
            child: Text(
              'Выберите одно или несколько настроений, и мы подберём фильм',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: AppColors.secondaryText),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                children: _allMoods.map((mood) {
                  final isSelected = selected.contains(mood);
                  return GestureDetector(
                    onTap: () {
                      final current =
                          List<String>.from(ref.read(selectedMoodsProvider));
                      if (isSelected) {
                        current.remove(mood);
                      } else {
                        current.add(mood);
                      }
                      ref.read(selectedMoodsProvider.notifier).state = current;
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.accent.withOpacity(0.15)
                            : AppColors.surface,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.accent
                              : Colors.transparent,
                          width: 1.5,
                        ),
                      ),
                      child: Text(
                        moodLabel(mood),
                        style: TextStyle(
                          color: isSelected
                              ? AppColors.accent
                              : AppColors.primaryText,
                          fontSize: 14,
                          fontWeight: isSelected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _pickMovie(context, ref, selected),
                child: Text(
                  selected.isEmpty
                      ? 'Случайный фильм'
                      : 'Найти фильм (${selected.length})',
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _pickMovie(
      BuildContext context, WidgetRef ref, List<String> selected) {
    final repo = ref.read(movieRepositoryProvider);
    final movie = repo.getRandomByMoods(selected);
    if (movie == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Фильмы по выбранным настроениям не найдены')),
      );
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => MovieDetailsScreen(movie: movie)),
    );
  }
}
