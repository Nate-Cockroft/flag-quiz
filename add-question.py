import csv
import sys
import os

CSV_PATH = "questions.csv"
PASSWORD = "flagquiz2026"

def main():
    if len(sys.argv) < 2:
        print("Usage: python add-question.py <flag_image_url>")
        print("Example: python add-question.py https://example.com/flag.png")
        sys.exit(1)

    image_url = sys.argv[1]

    password = input("Enter admin password: ")

    if password != PASSWORD:
        print("Access denied.")
        sys.exit(1)

    print("\n--- AI Question Generator ---")
    print("Flag URL: " + image_url)
    print("I will generate the question, answer options, and correct answer number.\n")

    question = input("Question text (e.g., \"What country is this?\"): ").strip()
    if not question:
        print("Question cannot be empty.")
        sys.exit(1)

    opt1 = input("Option 1: ").strip()
    opt2 = input("Option 2: ").strip()
    opt3 = input("Option 3: ").strip()
    opt4 = input("Option 4: ").strip()

    if not all([opt1, opt2, opt3, opt4]):
        print("All options are required.")
        sys.exit(1)

    correct_index = input("Correct option number (1-4): ").strip()

    try:
        correct_num = int(correct_index)
    except ValueError:
        print("Invalid option number. Must be 1-4.")
        sys.exit(1)

    if correct_num < 1 or correct_num > 4:
        print("Invalid option number. Must be 1-4.")
        sys.exit(1)

    csv_line = [question, image_url, opt1, opt2, opt3, opt4, str(correct_num)]

    print("\nPreview:")
    print("\t".join(csv_line))

    confirm = input("\nAdd this question to CSV? (y/n): ").strip().lower()

    if confirm == "y":
        with open(CSV_PATH, "a", newline="") as f:
            writer = csv.writer(f, delimiter="\t")
            writer.writerow(csv_line)
        print("Question added successfully!")
    else:
        print("Question discarded.")

if __name__ == "__main__":
    main()