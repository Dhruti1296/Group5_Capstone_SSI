# Testing Documentation — SSI Portal

## Manual Test Cases

### Authentication
| Test               | Steps                                | Expected                          |
|--------------------|--------------------------------------|-----------------------------------|
| Register new user  | Go to /register, fill form, submit   | "Registration successful" toast   |
| Login valid user   | Go to /login, enter credentials      | Redirected to /dashboard          |
| Login wrong password | Enter wrong password 3 times       | Account locked for 5 hours        |
| Login locked account | Try login while locked             | Lock expiry time shown            |
| Admin login        | Go to /admin/login, enter credentials | Redirected to /admin/dashboard   |

### Posts & Feed
| Test            | Steps                                | Expected                          |
|-----------------|--------------------------------------|-----------------------------------|
| Create post     | Click post box, type, click Post     | Post appears at top of feed       |
| Like post       | Click heart icon                     | Heart turns red, count increases  |
| Unlike post     | Click heart again                    | Heart turns grey, count decreases |
| Comment on post | Expand comments, type, press Enter   | Comment appears                   |
| Delete own post | Click trash icon                     | Post removed from feed            |

### Mentorship
| Test              | Steps                                           | Expected                          |
|-------------------|-------------------------------------------------|-----------------------------------|
| Apply to be mentor | Alumni → /become-mentor, fill form             | "Under Review" status shown       |
| Approve mentor    | Admin → Mentor Applications → Approve           | Notification sent to alumni       |
| Request mentor    | Student → /mentor, click Request                | Button changes to Requested       |
| Accept request    | Alumni → Dashboard → Accept                     | Mentee appears in mentees list    |
| Send chat message | Click chat button, type message                 | Message appears with single tick  |
| Read receipt      | Other user opens chat                           | Ticks turn blue (double tick)     |

### Volunteer
| Test                 | Steps                                              | Expected                          |
|----------------------|----------------------------------------------------|-----------------------------------|
| Create opportunity   | Admin → Volunteer Opportunities → + New            | Opportunity appears in list       |
| Apply for opportunity| Student → /volunteer → Apply Now                   | Button changes to ✓ Applied       |
| Approve application  | Admin → Volunteer Applications → Approve           | Green banner shown to student     |
| Reject application   | Admin → Volunteer Applications → Reject            | Red banner shown to student       |

### News & Events
| Test              | Steps                        | Expected                          |
|-------------------|------------------------------|-----------------------------------|
| View news         | Go to /news                  | Live articles from Conestoga      |
| View news detail  | Click on article             | Full article with image           |
| View events       | Go to /events                | Live events table                 |
| View event detail | Click on event               | Date, time, location, links       |
| SSI Events tab    | Click SSI Events tab         | Custom events from microservice   |

### Admin
| Test              | Steps                                           | Expected                          |
|-------------------|-------------------------------------------------|-----------------------------------|
| Delete user       | Admin → Manage Users → Delete                   | User removed from list            |
| Delete post       | Admin → Post Moderation → Delete Post           | Post removed                      |
| Delete comment    | Admin → Post Moderation → Show Comments → ✕     | Comment removed                   |
| Create SSI event  | Admin → SSI Events → + New Event                | Event appears on /events SSI tab  |

### Notifications
| Test            | Steps                        | Expected                          |
|-----------------|------------------------------|-----------------------------------|
| Bell badge      | Trigger an approval          | Red badge appears on bell         |
| Mark all read   | Click Mark all read          | Badge disappears                  |
| Mark one read   | Click a notification         | That notification fades           |

---

## Known Issues
- Event Microservice must be running separately on port **5237**  
- SSI Events tab shows empty if microservice is not running  
- Profile pictures stored as base64 may load slowly for large images  