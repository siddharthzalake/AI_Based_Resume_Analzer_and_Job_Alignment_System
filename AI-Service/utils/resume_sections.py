def split_resume_sections(text):

    sections = {
        "skills": "",
        "projects": "",
        "experience": "",
        "education": "",
        "other": ""
    }

    current = "other"

    for line in text.split("\n"):

        l = line.lower()

        if "skill" in l:
            current = "skills"

        elif "project" in l:
            current = "projects"

        elif "experience" in l:
            current = "experience"

        elif "education" in l:
            current = "education"

        sections[current] += line + "\n"

    return sections