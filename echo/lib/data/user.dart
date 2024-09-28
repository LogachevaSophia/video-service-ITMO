class User {
  final String id;
  final String mail;
  final String name;
  final String surname;
  final String phone;

  User({
    required this.id,
    required this.mail,
    required this.name,
    required this.surname,
    required this.phone,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      mail: json['mail'],
      name: json['name'],
      surname: json['surname'],
      phone: json['phone'],
    );
  }
}