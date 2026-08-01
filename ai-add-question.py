import requests
import json
import sys
import os
import subprocess

LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"
GITHUB_REPO = "Nate-Cockroft/flag-quiz"
CSV_PATH = "questions.csv"

def get_ai_response(image_url, country_name):
    system_prompt = (
        "You are a flag quiz question generator. Given a flag image URL and a country name, "
        "generate a multiple-choice question with 4 options. "
        "Return ONLY a JSON object with these keys: question, options (array of 4 strings), correct_index (1-4). "
        "The options should include the correct country name and 3 plausible distractors. "
        "The question should be 'What country is this?' or similar."
    )

    user_prompt = (
        f"Flag image URL: {image_url}\n"
        f"Country name: {country_name}\n\n"
        f"Generate a quiz question in JSON format."
    )

    payload = {
        "model": "local-model",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 500
    }

    try:
        response = requests.post(LM_STUDIO_URL, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        content = result["choices"][0]["message"]["content"]

        try:
            json_start = content.index("{")
            json_end = content.rindex("}") + 1
            json_str = content[json_start:json_end]
            data = json.loads(json_str)
            return data
        except (ValueError, json.JSONDecodeError) as e:
            print(f"Failed to parse AI response as JSON: {e}")
            print(f"Raw response: {content}")
            return None

    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to LM Studio. Make sure it's running on localhost:1234.")
        return None
    except requests.exceptions.Timeout:
        print("Error: LM Studio request timed out.")
        return None
    except Exception as e:
        print(f"Error calling LM Studio: {e}")
        return None

def append_to_csv(question, image_url, options, correct_index):
    csv_line = f"{question}\t{image_url}\t{options[0]}\t{options[1]}\t{options[2]}\t{options[3]}\t{correct_index}"

    with open(CSV_PATH, "a", newline="") as f:
        f.write("\n" + csv_line)

    print(f"\nAdded to {CSV_PATH}:")
    print(csv_line)
    return csv_line

def commit_and_push(csv_line, github_pat):
    if not github_pat:
        print("\nNo GitHub PAT provided. Skipping git push.")
        print("Manually commit and push with:")
        print('  git add questions.csv && git commit -m "Add question" && git push origin HEAD:master')
        return False

    try:
        subprocess.run(
            ["git", "add", CSV_PATH],
            check=True,
            capture_output=True
        )

        subprocess.run(
            ["git", "commit", "-m", f"Add question: {csv_line[:80]}"],
            check=True,
            capture_output=True
        )

        remote_url = f"https://{github_pat}@github.com/{GITHUB_REPO}.git"
        subprocess.run(
            ["git", "push", remote_url, "HEAD:master"],
            check=True,
            capture_output=True
        )

        print("Pushed to GitHub successfully!")
        return True

    except subprocess.CalledProcessError as e:
        print(f"Git error: {e.stderr.decode().strip() if e.stderr else str(e)}")
        return False

def main():
    print("=== Flag Quiz AI Question Generator ===\n")

    image_url = input("Enter flag image URL: ").strip()
    if not image_url:
        print("Image URL is required.")
        sys.exit(1)

    country_name = input("Enter country name: ").strip()
    if not country_name:
        print("Country name is required.")
        sys.exit(1)

    print(f"\nQuerying LM Studio for: {country_name}...")
    result = get_ai_response(image_url, country_name)

    if not result:
        print("Failed to get AI response.")
        sys.exit(1)

    print(f"\nAI Generated:")
    print(f"  Question: {result.get('question', 'N/A')}")
    for i, opt in enumerate(result.get("options", [])):
        print(f"  Option {i+1}: {opt}")
    print(f"  Correct: {result.get('correct_index', 'N/A')}")

    confirm = input("\nAdd this to questions.csv? (y/n): ").strip().lower()
    if confirm != "y":
        print("Discarded.")
        sys.exit(0)

    csv_line = append_to_csv(
        result["question"],
        image_url,
        result["options"],
        result["correct_index"]
    )

    github_pat = os.environ.get("GITHUB_PAT", "")
    if not github_pat:
        pat_input = input("\nEnter GitHub PAT to push (or press Enter to skip): ").strip()
        if pat_input:
            github_pat = pat_input

    if github_pat:
        commit_and_push(csv_line, github_pat)
    else:
        print("\nSkipped git push.")

if __name__ == "__main__":
    main()