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
<br/>
x = 5;
<br/>
y = 10; print(x + y);
<br/>
<br/>
AWAITING OUTPUT:
<br/>
A: 15
<br/>
B: 510
<br/>
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
 <br/>
if n == 0:
<br/>
return 1
<br/>
else:
<br/>
return n * factorial(n-1);
<br/>
<br/>
AWAITING OUTPUT:
<br/>
A: Sorts numbers,
<br/>
B: Finds the largest number in a list,
<br/>
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
<br/>
x = [1, 2, 3]
<br/>
print(len(x))
<br/>
<br/>
AWAITING OUTPUT:
<br/>
A: 2
<br/>
B: 3
<br/>
C: Error',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

IMPLEMENT FROM HERE

TASK 4.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = 10;
<br/>
let y = "5";
<br/>
console.log(x+y);
<br/>
<br/>
AWAITING OUTPUT:
<br/>
A: "105"
<br/>
B: 15
<br/>
C: "15"',
'"A"',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 5.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = [1, 2, 3];
<br/>
console.log(x.length);
<br/>
<br/>
AWAITING OUTPUT:
<br/>
A: Prints the elements of the array
<br/>
B: Prints 3
<br/>
C: Error,
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK .

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>

<br/>
AWAITING OUTPUT:
<br/>
A:
<br/>
B:
<br/>
C:',
'',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________



__________________________________________________________________________________________________________________


Lisäämättömät:

TASK 31.

INSERT INTO task (text, answer, travelprompt, pay)
VALUES (
'INPUT:
<br/>
Write a Python function that takes a list of integers as input
<br/>
and returns the sum of the squares of the integers in the list.
<br/>
For example: If the input is [1, 2, 3], the output should be 1^2 + 2^2 + 3^2 = 14.
<br/>
Which of the following implementations is correct?
<br/>
<br/>
AWAITING OUTPUT:
<br/>
A: def sum_of_squares(numbers):
<br/>
  return sum(x ** 2 for x in numbers)
<br/>
B: def sum_of_squares(numbers):
<br/>
  return sum(x * 2 for x in numbers)
<br/>
C: def sum_of_squares(numbers):
<br/>
  total = 0
<br/>
    for x in numbers:
<br/>
      total += x
<br/>
      return total',
    'A',
    'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
    '200'
);


__________________________________________________________________________________________________________________

TASK 32.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
    'INPUT:
<br/>
class Animal:
<br/>
    def __init__(self, name):
<br/>
        self.name = name
<br/>
    def speak(self):
<br/>
        return "Some sound"
<br/>
class Dog(Animal):
<br/>
    def speak(self):
<br/>
        return "Woof!"
<br/>
<br/>
# Create an object of Dog
<br/>
dog = Dog("Buddy")
<br/>
What does the following code output?
<br/>
<br/>
print(dog.speak())
<br/>
<br/>
A. Outputs: "Woof!"
<br/>
B. Outputs: "Some sound"
<br/>
C. Raises an error: AttributeError
',
    'A',
    'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
    '200'
);

*/