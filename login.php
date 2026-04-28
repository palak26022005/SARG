<?php
// Always return plain HTML or redirect, not JSON
$conn = new mysqli("localhost", "u293157276_sarg_bot", "2025#Human", "u293157276_sarg_chatt");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"] ?? '';
    $password = $_POST["password"] ?? '';

    // Check if user exists
    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        // ✅ Login successful
        header("Location: dashboard.html");
        exit();
    } else {
        // ❌ Invalid credentials
        echo "<script>alert('Invalid email or password. Please register first.'); window.location.href='index.html';</script>";
    }
}
$conn->close();
?>