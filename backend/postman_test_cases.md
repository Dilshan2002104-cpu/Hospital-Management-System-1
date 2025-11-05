# Postman Test Cases for User Management API

## Positive Test Cases

### 1. Create Valid User
```json
POST /api/v1/users/
{
  "name": "Dr. Sarah Johnson",
  "employee_id": "EMP002",
  "role": "Doctor",
  "department_id": 1,
  "password": "MedPass123"
}
```
Expected: 201 Created with user details

### 2. Create Nurse
```json
POST /api/v1/users/
{
  "name": "Mary Williams",
  "employee_id": "EMP003",
  "role": "Nurse",
  "department_id": 1,
  "password": "NursePass456",
  "phone": "555-0199"
}
```
Expected: 201 Created

### 3. Create Lab Technician
```json
POST /api/v1/users/
{
  "name": "Bob Martinez",
  "employee_id": "EMP004",
  "role": "Lab Technician",
  "department_id": 2,
  "password": "LabPass789"
}
```
Expected: 201 Created

## Negative Test Cases

### 1. Duplicate Employee ID
```json
POST /api/v1/users/
{
  "name": "Jane Doe",
  "employee_id": "EMP002",
  "role": "Doctor",
  "department_id": 1,
  "password": "TestPass123"
}
```
Expected: 400 Bad Request - "Employee ID 'EMP002' already exists"

### 2. Invalid Employee ID Format
```json
POST /api/v1/users/
{
  "name": "Test User",
  "employee_id": "123",
  "role": "Doctor",
  "department_id": 1,
  "password": "TestPass123"
}
```
Expected: 400 Bad Request - Employee ID format validation error

### 3. Invalid Role
```json
POST /api/v1/users/
{
  "name": "Test User",
  "employee_id": "EMP005",
  "role": "InvalidRole",
  "department_id": 1,
  "password": "TestPass123"
}
```
Expected: 400 Bad Request - Role validation error

### 4. Missing Required Fields
```json
POST /api/v1/users/
{
  "name": "Test User",
  "role": "Doctor"
}
```
Expected: 422 Unprocessable Entity - Missing required fields

### 5. Weak Password
```json
POST /api/v1/users/
{
  "name": "Test User",
  "employee_id": "EMP005",
  "role": "Doctor",
  "department_id": 1,
  "password": "123"
}
```
Expected: 400 Bad Request - Password validation error

### 6. Invalid Department ID
```json
POST /api/v1/users/
{
  "name": "Test User",
  "employee_id": "EMP005",
  "role": "Doctor",
  "department_id": 999,
  "password": "TestPass123"
}
```
Expected: 400 Bad Request or 404 Not Found

### 7. Get Non-existent User
```
GET /api/v1/users/999
```
Expected: 404 Not Found

### 8. Update Non-existent User
```
PUT /api/v1/users/999
```
Expected: 404 Not Found

### 9. Delete Non-existent User
```
DELETE /api/v1/users/999
```
Expected: 404 Not Found

### 10. Invalid Password Update
```json
PUT /api/v1/users/1/password
{
  "current_password": "wrongpassword",
  "new_password": "NewPass123"
}
```
Expected: 400 Bad Request - Current password is incorrect

## Boundary Testing

### 1. Long Name
```json
{
  "name": "A very very very long name that exceeds normal limits and should be tested for validation purposes in the system to ensure proper handling",
  "employee_id": "EMP006",
  "role": "Doctor",
  "department_id": 1,
  "password": "TestPass123"
}
```

### 2. Special Characters in Name
```json
{
  "name": "Dr. O'Connor-Smith Jr.",
  "employee_id": "EMP007",
  "role": "Doctor",
  "department_id": 1,
  "password": "TestPass123"
}
```

### 3. Edge Case Employee IDs
```json
{
  "employee_id": "DOC001"
}
```
```json
{
  "employee_id": "NURSE001"
}
```

## Performance Testing

### 1. Create Multiple Users Rapidly
- Create 10-20 users quickly to test concurrent creation
- Use different employee IDs for each

### 2. Search with Various Terms
- Search for partial names
- Search for employee IDs
- Search for non-existent terms

### 3. Pagination Testing
```
GET /api/v1/users/?skip=0&limit=5
GET /api/v1/users/?skip=5&limit=5
GET /api/v1/users/?skip=10&limit=5
```

## Data Validation Testing

### 1. Phone Number Formats
```json
{
  "phone": "555-0123"
}
```
```json
{
  "phone": "(555) 012-3456"
}
```
```json
{
  "phone": "5550123456"
}
```
```json
{
  "phone": "+1-555-012-3456"
}
```

### 2. Status Values
```json
{
  "status": "Active"
}
```
```json
{
  "status": "Inactive"
}
```
```json
{
  "status": "Suspended"
}
```

## API Response Verification

Ensure all responses include:
- Correct HTTP status codes
- Proper JSON structure
- All required fields
- Consistent date formats
- Department information populated
- No sensitive data (passwords) in responses