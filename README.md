# Space Exploration Website

## Overview

The Space Exploration Website is a platform designed to provide users with accessible and informative content about space missions, rovers, astronauts, and significant milestones achieved in space exploration. It offers an immersive experience for exploring space-related topics through a user-friendly interface and robust functionality.

## Features

- **User Authentication**: Users can log in or sign up to access personalized features.
- **Article-Based Content**: Structured articles on missions, rovers, and astronauts provide comprehensive information about space exploration topics.
- **Filtering Options**: Users can filter articles by criteria such as agency, launch year, and mission type.
- **Bookmarking**: Users can bookmark articles for later reference, with bookmark counts tracked for each user.
- **Milestones**: A dedicated page highlights significant achievements in space exploration, sorted by date.
- **User Profile**: Users can update their usernames and manage their bookmarks efficiently.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask)
- **Database**: MySQL
- **Additional Tools**: AJAX for asynchronous requests

## Database Structure

The database schema consists of the following tables:

1. **Missions**: Contains information about space missions, including mission ID, name, agency, launch date, target celestial body, purpose, status, image URL, and content.
2. **Rovers**: Stores details about rovers, such as rover ID, name, associated mission ID, landing date, image URL, content, mission duration, type, destination, landing site, and rover type.
3. **Astronauts**: Holds data regarding astronauts, including astronaut ID, name, nationality, missions participated, image URL, content, birth date, time in space, total EVAs (extravehicular activities), total EVA time, and death date.
4. **Milestones**: Records significant achievements in space exploration, with fields for milestone ID, associated mission ID, associated rover ID (if applicable), title, and description.
5. **Users**: Stores user information, including user ID, username, email, and password.
6. **Astronaut Bookmarks**: Tracks user bookmarks for astronaut articles, linking user IDs with astronaut IDs.
7. **Mission Bookmarks**: Manages user bookmarks for mission articles, associating user IDs with mission IDs.
8. **Rover Bookmarks**: Maintains user bookmarks for rover articles, connecting user IDs with rover IDs.

### ER-Diagran
![F9ACD449-19D7-47B8-8B9E-DFC40C23DD12](https://github.com/Srikar-V675/Space-Exploration/assets/139987819/635af468-8c9b-4a32-9580-1f0a0208b5c0)

### Schema
![54A54546-85D7-47D8-A13E-D1D9720A68AE](https://github.com/Srikar-V675/Space-Exploration/assets/139987819/f408c296-99e5-43e0-8617-ec0b4b48d975)

## Conclusion

In conclusion, the Space Exploration Website project was instrumental in deepening my understanding of APIs, routine tasks, and database management while honing my skills in full-stack development. By building a comprehensive application encompassing frontend, backend, and database components, I gained practical experience in designing and implementing complex software solutions. This project not only showcased my technical abilities but also reinforced my passion for creating impactful and user-centric applications.

---
