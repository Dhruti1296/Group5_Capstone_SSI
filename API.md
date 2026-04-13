# API Documentation — SSI Portal

**Base URL:** `http://localhost:5277`  
**Auth:** Bearer JWT token in Authorization header  

---

## Authentication
| Method | Endpoint              | Auth | Description             |
|--------|-----------------------|------|-------------------------|
| POST   | /api/auth/register    | None | Register new user       |
| POST   | /api/auth/login       | None | Login                   |
| POST   | /api/auth/create-admin| None | Create admin (TEMP)     |

---

## User
| Method | Endpoint                          | Auth | Description                  |
|--------|-----------------------------------|------|------------------------------|
| GET    | /api/user/me                      | JWT  | Get current user profile     |
| PUT    | /api/user/me                      | JWT  | Update profile               |
| GET    | /api/user/list?role=              | None | List users by role           |
| PATCH  | /api/user/fix-profile-pics        | None | Fix bad profile pics (TEMP)  |

---

## Posts
| Method | Endpoint                  | Auth | Description        |
|--------|---------------------------|------|--------------------|
| GET    | /api/posts                | JWT  | Get all posts      |
| POST   | /api/posts                | JWT  | Create post        |
| DELETE | /api/posts/{id}           | JWT  | Delete own post    |
| POST   | /api/posts/{id}/like      | JWT  | Toggle like        |
| POST   | /api/posts/{id}/comment   | JWT  | Add comment        |

---

## Mentor
| Method | Endpoint                     | Auth  | Description          |
|--------|------------------------------|-------|----------------------|
| GET    | /api/mentor                  | JWT   | Get approved mentors |
| POST   | /api/mentor/apply            | JWT   | Apply to be mentor   |
| GET    | /api/mentor/my-application   | JWT   | Get own application  |
| PATCH  | /api/mentor/{id}/approve     | Admin | Approve mentor       |
| PATCH  | /api/mentor/{id}/reject      | Admin | Reject mentor        |

---

## Mentorship
| Method | Endpoint                                | Auth | Description             |
|--------|-----------------------------------------|------|-------------------------|
| POST   | /api/mentorship/request                 | JWT  | Request a mentor        |
| GET    | /api/mentorship/my-mentor               | JWT  | Get my mentor           |
| GET    | /api/mentorship/my-mentees              | JWT  | Get my mentees          |
| GET    | /api/mentorship/my-requests             | JWT  | Get pending requests    |
| PATCH  | /api/mentorship/{id}/accept             | JWT  | Accept request          |
| PATCH  | /api/mentorship/{id}/decline            | JWT  | Decline request         |
| GET    | /api/mentorship/chat/{roomId}           | JWT  | Get chat history        |
| PATCH  | /api/mentorship/chat/{roomId}/mark-read | JWT  | Mark messages read      |
| GET    | /api/mentorship/unread-counts           | JWT  | Get unread counts       |

---

## Volunteer
| Method | Endpoint                       | Auth | Description              |
|--------|--------------------------------|------|--------------------------|
| GET    | /api/volunteer/opportunities   | None | Get open opportunities   |
| POST   | /api/volunteer/apply           | JWT  | Apply for opportunity    |
| GET    | /api/volunteer/my-applications | JWT  | Get my applications      |

---

## Notifications
| Method | Endpoint                          | Auth | Description          |
|--------|-----------------------------------|------|----------------------|
| GET    | /api/notifications                | JWT  | Get all notifications|
| GET    | /api/notifications/unread-count   | JWT  | Get unread count     |
| PATCH  | /api/notifications/mark-all-read  | JWT  | Mark all read        |
| PATCH  | /api/notifications/{id}/read      | JWT  | Mark one read        |

---

## News & Events (Scraper)
| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| GET    | /api/news                 | None | Get scraped news list    |
| GET    | /api/news/detail?url=     | None | Get news article detail  |
| GET    | /api/events               | None | Get scraped events list  |
| GET    | /api/events/detail?url=   | None | Get event detail         |

---

## Admin
| Method | Endpoint                                         | Auth  | Description                |
|--------|--------------------------------------------------|-------|----------------------------|
| GET    | /api/admin/users                                 | Admin | Get all users              |
| DELETE | /api/admin/users/{userName}                      | Admin | Delete user                |
| GET    | /api/admin/posts                                 | Admin | Get all posts              |
| DELETE | /api/admin/posts/{id}                            | Admin | Delete post                |
| DELETE | /api/admin/posts/{postId}/comments/{index}       | Admin | Delete comment             |
| GET    | /api/admin/mentor-applications                   | Admin | Get mentor applications    |
| GET    | /api/admin/volunteer-applications                | Admin | Get volunteer applications |
| PATCH  | /api/admin/volunteer-applications/{id}/status    | Admin | Update volunteer status    |
| GET    | /api/admin/volunteer-opportunities               | Admin | Get opportunities          |
| POST   | /api/admin/volunteer-opportunities               | Admin | Create opportunity         |
| PUT    | /api/admin/volunteer-opportunities/{id}          | Admin | Update opportunity         |
| DELETE | /api/admin/volunteer-opportunities/{id}          | Admin | Delete opportunity         |
| GET    | /api/admins/{userName}                           | None  | Validate admin (microservice)|

---

## Event Microservice
**Base URL:** `http://localhost:5237`

| Method | Endpoint                  | Auth             | Description        |
|--------|---------------------------|------------------|--------------------|
| GET    | /api/events               | None             | Get all SSI events |
| GET    | /api/events/{id}          | None             | Get event by ID    |
| GET    | /api/events/type/{type}   | None             | Get events by type |
| POST   | /api/events               | Header: adminUserName | Create event   |
| PUT    | /api/events/{id}          | Header: adminUserName | Update event   |
| DELETE | /api/events/{id}          | Header: adminUserName | Delete event   |

---

## SignalR Hub
**URL:** `ws://localhost:5277/hubs/chat?access_token={jwt}`

| Method                | Description                         |
|------------------------|------------------------------------|
| JoinRoom(roomId)       | Join a chat room                   |
| LeaveRoom(roomId)      | Leave a chat room                  |
| SendMessage(roomId,msg)| Send a message                     |
| ReceiveMessage         | Event received when message arrives|