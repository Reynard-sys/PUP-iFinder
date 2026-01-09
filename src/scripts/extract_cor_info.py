from PyPDF2 import PdfReader
import re
import json
import sys

def extract_cor_info(pdf_path):
    reader = PdfReader(pdf_path)
    text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

    student_id_match = re.search(r"\b\d{4}-\d{5}-[A-Z]{2}-\d\b", text)
    student_id = student_id_match.group(0) if student_id_match else None

    program_code_match = re.search(r"PROGRAM CODE:\s*([A-Z0-9]+)", text)
    program_code = program_code_match.group(1) if program_code_match else None

    year_level_match = re.search(r"YEAR LEVEL:\s*([A-Za-z ]+)", text)
    year_level_raw = year_level_match.group(1).strip() if year_level_match else None

    year_level_cut = re.search(r"([A-Za-z]+(?:\s+[A-Za-z]+)?\s+Year)", year_level_raw or "")
    year_level_text = year_level_cut.group(1) if year_level_cut else year_level_raw

    year_map = {
        "First Year": 1,
        "Second Year": 2,
        "Third Year": 3,
        "Fourth Year": 4
    }

    year_level = year_map.get(year_level_text, year_level_text)

    section_match = re.search(r"SECTION:\s*(\d+)", text)
    section = int(section_match.group(1)) if section_match else None

    pattern = r"([A-Z]{4,5}\s\d{3})\s+(.+?)\s+(BSIT\s[\d-]+)\s+(.+)"
    matches = re.findall(pattern, text)

    results = []
    for code, title, section_code, schedule in matches:
        results.append({
            "subject_code": code.strip(),
            "subject_title": title.strip(),
            "section_code": section_code.strip(),
            "schedule": schedule.strip()
        })

    return {
        "student_id": student_id,
        "program": program_code,
        "yearlevel": year_level,
        "BlockNumber": section,
        "subjects": results
    }

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    data = extract_cor_info(pdf_path)
    print(json.dumps(data))
