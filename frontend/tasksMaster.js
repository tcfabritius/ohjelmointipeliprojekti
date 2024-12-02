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

TASK 4.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
Write a Python function that takes a list of integers as input and returns the sum of the squares of the integers in the list.
For example:
If the input is [1, 2, 3], the output should be 1^2 + 2^2 + 3^2 = 14.
Which of the following implementations is correct?

AWAITING OUTPUT:
A: def sum_of_squares(numbers):
    return sum(x ** 2 for x in numbers)
B: def sum_of_squares(numbers):
    return sum(x * 2 for x in numbers)
C: def sum_of_squares(numbers):
    total = 0
    for x in numbers:
        total += x
    return total',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

*/