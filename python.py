import random

def number_guessing_game():
    """
    Plays a number guessing game with the user.

    The computer generates a random number between 1 and 100, 
    and the user has to guess it. The computer provides hints 
    ("higher" or "lower") until the user guesses correctly.
    """

    number_to_guess = random.randint(1, 100)
    guess = 0
    attempts = 0

    print("I'm thinking of a number between 1 and 100.")

    while guess != number_to_guess:
        try:
            guess = int(input("Take a guess: "))
            attempts += 1

            if guess < number_to_guess:
                print("Higher!")
            elif guess > number_to_guess:
                print("Lower!")

        except ValueError:
            print("Invalid input. Please enter a number.")

    print(f"Congratulations! You guessed the number {number_to_guess} in {attempts} attempts.")


number_guessing_game()