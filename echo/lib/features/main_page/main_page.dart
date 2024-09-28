import 'package:flutter/material.dart';
import 'package:echo/features/home_page/home_page.dart';
import 'package:echo/features/profile_page/profile_page.dart';
import 'package:ionicons/ionicons.dart';

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);
  static const routeName = '/mainPage';

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int currentPageIndex = 1;

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
              topRight: Radius.circular(20), topLeft: Radius.circular(20)),
        ),
        child: BottomNavigationBar(
          backgroundColor: const Color(0xff6b19ae),
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white,
          onTap: (index) {
            setState(() {
              currentPageIndex = index;
            });
          },
          currentIndex: currentPageIndex,
          items: [
            BottomNavigationBarItem(
              icon: currentPageIndex == 0
                  ? const Icon(
                      Icons.home,
                      color: Colors.white,
                      size: 40,
                    )
                  : const Icon(
                      Icons.home_outlined,
                      color: Colors.white,
                      size: 40,
                    ),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: currentPageIndex == 1
                  ? const Icon(
                      Ionicons.card,
                      color: Colors.white,
                      size: 40,
                    )
                  : const Icon(
                      Ionicons.card_outline,
                      color: Colors.white,
                      size: 40,
                    ),
              label: 'Cards',
            )
          ],
        ),
      ),
      body: <Widget>[HomePage(), ProfilePage()][currentPageIndex],
    );
  }
}
