import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'data/movie_repository.dart';
import 'providers/providers.dart';
import 'screens/home_screen.dart';
import 'theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  await Hive.openBox('favorites');

  final repo = MovieRepository();
  await repo.init();

  runApp(
    ProviderScope(
      overrides: [
        movieRepositoryProvider.overrideWithValue(repo),
      ],
      child: const MovieSwipeApp(),
    ),
  );
}

class MovieSwipeApp extends StatelessWidget {
  const MovieSwipeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MovieSwipe',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      home: const HomeScreen(),
    );
  }
}
