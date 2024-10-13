import 'package:echo/features/main_page/bottom_bar_item.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainPage extends StatefulWidget {
  const MainPage(this.child, {Key? key}) : super(key: key);
  static const routeName = '/mainPage';
  final Widget child;

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  @override
  void initState() {
    super.initState();
  }

  int getCurrentPageIndex() {
    final route = GoRouterState.of(context).uri.path;

    switch (route) {
      case '/home':
        return 0;
      case '/room':
        return 1;
      case '/profile':
        return 2;
      default:
        return 0;
    }
  }

  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0:
        GoRouter.of(context).go('/home');
      case 1:
        GoRouter.of(context).go('/room');
      case 2:
        GoRouter.of(context).go('/profile');
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentPageIndex = getCurrentPageIndex();

    return Scaffold(
      bottomNavigationBar: Container(
        clipBehavior: Clip.hardEdge,
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(10),
            topLeft: Radius.circular(10),
            bottomLeft: Radius.circular(10),
            bottomRight: Radius.circular(10),
          ),
        ),
        child: BottomNavigationBar(
          backgroundColor: const Color(0xFF2A4E75),
          showSelectedLabels: false,
          showUnselectedLabels: false,
          onTap: (index) => _onItemTapped(index, context),
          currentIndex: currentPageIndex,
          items: [
            BottomNavigationBarItem(
              icon: BottomBarItem(
                iconPath: 'assets/images/home_icon.svg',
                isSelected: currentPageIndex == 0,
              ),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: BottomBarItem(
                iconPath: 'assets/images/tv_icon.svg',
                isSelected: currentPageIndex == 1,
              ),
              label: 'Join',
            ),
            BottomNavigationBarItem(
              icon: BottomBarItem(
                iconPath: 'assets/images/other_icon.svg',
                isSelected: currentPageIndex == 2,
              ),
              label: 'Profile',
            ),
          ],
        ),
      ),
      body: widget.child,
    );
  }
}
