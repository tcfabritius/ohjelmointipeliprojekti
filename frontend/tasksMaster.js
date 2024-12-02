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
AWAITING OUTPUT:
<br/>
A: Prints the elements of the array
<br/>
B: Error
<br/>
C: 3',
'C',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 6.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = 5;
<br/>
let y = x++;
<br/>
console.log(y);
<br/>
AWAITING OUTPUT:
<br/>
A: 6
<br/>
B: Error
<br/>
C: 5',
'C',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 7.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
.example {
<br/>
    color: red;
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: Changes background to red
<br/>
B: Changes text color to red
<br/>
C: Hides the element',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 8.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
body {
<br/>
    background-color: blue;
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: Sets the text color to blue
<br/>
B: Sets the background color to blue
<br/>
C: Makes the background image disappear',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 9.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
x = 3
<br/>
y = 4
<br/>
z = math.sqrt(x**2 + y**2)
<br/>
AWAITING OUTPUT:
<br/>
A: Calculates the hypotenuse
<br/>
B: Squares the numbers
<br/>
C: Finds the sum of x and y',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 10.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
def greet(name):
<br/>
    return "Hello " + name
<br/>
print(greet("Alice"))
<br/>
AWAITING OUTPUT:
<br/>
A: Error
<br/>
B: "Hello Alice"
<br/>
C: "greet(name)"',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 11.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
function greet(name) {
<br/>
    return `Hello, ${name}`;
<br/>
}
<br/>
console.log(greet("Bob"));
<br/>
AWAITING OUTPUT:
<br/>
A: "greet(name)"
<br/>
B: Error
<br/>
C: "Hello, Bob"',
'C',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 12.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let fruits = ["apple", "banana", "cherry"];
<br/>
console.log(fruits[1]);
<br/>
AWAITING OUTPUT:
<br/>
A: "banana"
<br/>
B: Error
<br/>
C: "apple"',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 13.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
# Python
<br/>
def square(x):
<br/>
    return x * x
<br/>
print(square(4))
<br/>
AWAITING OUTPUT:
<br/>
A: 16
<br/>
B: Error
<br/>
C: 8',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 14.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = "5";
<br/>
let y = 2;
<br/>
console.log(x * y);
<br/>
AWAITING OUTPUT:
<br/>
A: Error
<br/>
B: 10
<br/>
C: "52"',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 15.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
function add(a, b) {
<br/>
    return a + b;
<br/>
}
<br/>
console.log(add(7, 3));
<br/>
AWAITING OUTPUT:
<br/>
A: Error
<br/>
B: 10
<br/>
C: 73',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 16.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
def reverse(string):
<br/>
    return string[::-1]
<br/>
print(reverse("hello"))
<br/>
AWAITING OUTPUT:
<br/>
A: "olleh"
<br/>
B: Error
<br/>
C: "hello"',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 17.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
body {
<br/>
    margin: 0;
<br/>
    padding: 0;
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: Removes all default margin and padding
<br/>
B: Changes font size
<br/>
C: Hides the body',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 18.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
def is_even(n):
<br/>
    return n % 2 == 0
<br/>
print(is_even(10))
<br/>
AWAITING OUTPUT:
<br/>
A: True
<br/>
B: False
<br/>
C: Error',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 19.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
console.log(typeof "hello");
<br/>
AWAITING OUTPUT:
<br/>
A: "string"
<br/>
B: Error
<br/>
C: "object"',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 20.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = 10;
<br/>
if (x > 5) {
<br/>
    console.log("x is greater than 5");
<br/>
} else {
<br/>
    console.log("x is not greater than 5");
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: "x is greater than 5"
<br/>
B: "x is not greater than 5"
<br/>
C: Error',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 21.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
function greet(name) {
<br/>
    return `Hello ${name}`;
<br/>
}
<br/>
console.log(greet("Bob"));
<br/>
AWAITING OUTPUT:
<br/>
A: "greet(name)"
<br/>
B: "Hello Bob"
<br/>
C: Error',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 22.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = 10;
<br/>
if (x > 5) {
<br/>
    console.log("Success");
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: Prints "Success"
<br/>
B: Error
<br/>
C: Prints "x > 5"',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 23.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
.class {
<br/>
    font-size: 16px;
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: Sets font size to 16 pixels
<br/>
B: Changes color to 16px
<br/>
C: Hides the element',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 24.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
x = 10
<br/>
y = 20
<br/>
z = x * y
<br/>
print(z)
<br/>
AWAITING OUTPUT:
<br/>
A: 200
<br/>
B: 30
<br/>
C: 2000',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 25.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let arr = ["a", "b", "c"];
<br/>
console.log(arr[1]);
<br/>
AWAITING OUTPUT:
<br/>
A: "a"
<br/>
B: "b"
<br/>
C: "c"',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 26.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
const pi = 3.14;
<br/>
pi = 3.15;
<br/>
console.log(pi);
<br/>
AWAITING OUTPUT:
<br/>
A: 3.15
<br/>
B: Error
<br/>
C: 3.14',
'B',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 27.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
def sum(a, b):
<br/>
    return a + b
<br/>
print(sum(3, 4))
<br/>
AWAITING OUTPUT:
<br/>
A: 7
<br/>
B: Error
<br/>
C: "sum(a, b)"',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 28.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
<!DOCTYPE html>
<br/>
<html>
<br/>
<head>
<br/>
<title>Test</title>
<br/>
</head>
<br/>
<body>
<br/>
<p>Hello World</p>
<br/>
</body>
<br/>
</html>
<br/>
AWAITING OUTPUT:
<br/>
A: A simple webpage with "Hello World"
<br/>
B: Error
<br/>
C: Displays "Test"',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 29.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
body {
<br/>
    margin: 0;
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: Removes all margins from the body
<br/>
B: Sets margin to 0 pixels for all elements
<br/>
C: Adds a margin of 0',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________

TASK 30.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
'INPUT:
<br/>
let x = true;
<br/>
if (!x) {
<br/>
    console.log("False");
<br/>
} else {
<br/>
    console.log("True");
<br/>
}
<br/>
AWAITING OUTPUT:
<br/>
A: "True"
<br/>
B: "False"
<br/>
C: Error',
'A',
'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
'200'
);

__________________________________________________________________________________________________________________


Lisäämättömät:

TASK 31.

INSERT INTO task (text, answer, travelprompt, pay)
VALUES (
    'INPUT: Write a Python function that takes a list of integers as input and returns the sum of the squares of the integers in the list. For example: If the input is [1, 2, 3], the output should be 1^2 + 2^2 + 3^2 = 14. Which of the following implementations is correct?\n\nAWAITING OUTPUT:\nA: def sum_of_squares(numbers):\n    return sum(x ** 2 for x in numbers)\nB: def sum_of_squares(numbers):\n    return sum(x * 2 for x in numbers)\nC: def sum_of_squares(numbers):\n    total = 0\n    for x in numbers:\n        total += x\n    return total',
    'A',
    'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
    '200'
);


__________________________________________________________________________________________________________________

TASK 32.

INSERT INTO task (text, answer, travelprompt, pay) VALUES
(
    'INPUT:
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):
        return "Woof!"

# Create an object of Dog
dog = Dog("Buddy")
What does the following code output?

print(dog.speak())

A. Outputs: "Woof!"
B. Outputs: "Some sound"
C. Raises an error: AttributeError
',
    'A',
    'HELPER.BOT: My analysis indicates that the risk of capture is getting high. I recommend moving out soon.',
    '200'
);

*/