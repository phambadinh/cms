# MongoDB Seed Data for CMS Backend

This folder contains sample MongoDB data for the CMS backend.

## Import instructions

If you have `mongoimport` installed, run these commands from the `backend/db/seed` folder:

```bash
mongoimport --db cms_db --collection users --file users.json --jsonArray
mongoimport --db cms_db --collection courses --file courses.json --jsonArray
mongoimport --db cms_db --collection lessons --file lessons.json --jsonArray
mongoimport --db cms_db --collection enrollments --file enrollments.json --jsonArray
mongoimport --db cms_db --collection grades --file grades.json --jsonArray
mongoimport --db cms_db --collection quizzes --file quizzes.json --jsonArray
mongoimport --db cms_db --collection questions --file questions.json --jsonArray
mongoimport --db cms_db --collection quiz_attempts --file quiz_attempts.json --jsonArray
mongoimport --db cms_db --collection lesson_progress --file lesson_progress.json --jsonArray
```

If you are on Windows PowerShell, use the same commands.

## Notes

- Database URI in backend config: `mongodb://localhost:27017/cms_db`
- Credential mặc định sau import:
	- Admin: `admin` / `admin123`
	- Mentor: `mentor` / `password`
	- Student: `student` / `password`
- You may need to stop the backend before importing if collections already exist.
- The `_id` fields are strings to match Spring Data `String id` mapping.
