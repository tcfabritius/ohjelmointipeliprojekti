/*

MySQL-masterkomentosarja tehtävälisäyksille

Lisätyt:

ESIMERKKI
INSERT INTO task (text, answer, travelprompt, pay)
VALUES ('Esimerkki pseudokooditehtävä', 'Oikea vastaus', 'Siirry seuraavaan kaupunkiin', 100);

__________________________________________________________________________________________________________________

TASK 1.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
x = 5;
y = 10; print(x + y);

AWAITING OUTPUT:
A: 15
B: 510
C: Error',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 2.
INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
 def factorial(n):
     if n == 0:
         return 1
     else:
         return n * factorial(n-1);

AWAITING OUTPUT:
A: Sorts numbers,
B: Finds the largest number in a list,
C: Calculates factorial',
'C',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 3.
INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
x = [1, 2, 3]
print(len(x))

AWAITING OUTPUT:
A: 2
B: 3
C: Error',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

Lisäämättömät:


*/