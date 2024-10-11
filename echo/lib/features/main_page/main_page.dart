import 'package:echo/features/join_page/join_page.dart';
import 'package:echo/features/main_page/bottom_bar_item.dart';
import 'package:flutter/material.dart';
import 'package:echo/features/home_page/home_page.dart';
import 'package:echo/features/profile_page/profile_page.dart';

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);
  static const routeName = '/mainPage';

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int currentPageIndex = 0;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
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
          onTap: (index) {
            setState(() {
              currentPageIndex = index;
            });
          },
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
                isSelected: currentPageIndex == 1,
              ),
              label: 'Profile',
            ),
          ],
        ),
      ),
      body: IndexedStack(
        index: currentPageIndex,
        children: const [
          HomePage(),
          JoinPage(),
          ProfilePage(),
        ],
      ),
    );
  }
}
