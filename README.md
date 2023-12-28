# ThesiShare - Web Technologies project

The application has to handle the registration process for dissertation coordination requests.

The application is built on a **Single Page Application** architecture and is accessible from the browser on the desktop, mobile devices or tablets (depending on user preference).

> [!IMPORTANT]
> For backend, use `npm run rdb` to reset the database, and use `npm run dev` to start developing
> 
> For frontend, use `npm start` to start developing

# Functionalities

-   The application has two kinds of users, **students** and **professors**
-   A professor has a series of registration sessions, which cannot temporally overlap
-   During a registration session, a student can make a preliminary request to a professor
-   The professor can approved the student’s request within a pre established limit (a professor can only have a limit number of students coordinated)
-   The professor can also reject the request with a justification
-   A student can make multiple requests to multiple professors, but if they have been approved by one of them, they cannot be approved by another
-   After the request has been approved, the student can upload a file (the signed dissertation coordination request)
-   As a response to the coordination request, the professor can upload a file or they can reject the request, in which case the student must upload a new file

# Database Design

![Database Design](./database%20design.png)

# General requirements

## General objective

Developing an application on one of the specified topics, with a RESTful backend which accessed data stored in a relational database through a persistence API as well as data from an external service and an SPA front-end built with a component based framework.

## Technological constraints

-   Front-end must be build with a component based framework(React.js, which is covered in the course, or Angular 2+, Vue.js)
-   Back-end must have a REST interface and must be implemented in node.js
-   Storage must be over a relational database and access to the database must be done via an ORM
-   Code must be versioned in a git repository with incremental commits with clear descriptions

## Code quality and style

-   Real application, coherent from a business logic standpoint
-   The code must be well organized, variable names should be suggestive of their purpose and use a naming standard (e.g. camel case), the code should be indented for readability
-   The code must be documented with comments for each class, function etc.
-   Non working applications receive no points. However, functionality of the front-end or back-end can be demonstrated separately
