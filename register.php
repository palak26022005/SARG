<?php
header('Content-Type: application/json');

// DB connection
$conn = new mysqli("localhost", "u293157276_sarg_bot", "2025#Human", "u293157276_sarg_chatt");
if ($conn->connect_error) {
    echo json_encode(["success"=>false,"message"=>"DB connection failed: ".$conn->connect_error]);
    exit;
}

// Upload folder
$uploadDir = __DIR__ . "/uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// File save helper
function saveFile($key, $uploadDir) {
    if (isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK) {
        $filename = time() . "_" . basename($_FILES[$key]['name']);
        $targetPath = $uploadDir . $filename;
        if (move_uploaded_file($_FILES[$key]['tmp_name'], $targetPath)) {
            return "uploads/" . $filename; // path for DB
        }
    }
    return "";
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form fields
    $name = $_POST["name"] ?? '';
    $email = $_POST["email"] ?? '';
    $contact = $_POST["contact"] ?? '';
    $occupation = $_POST["occupation"] ?? '';
    $organization = $_POST["organization"] ?? '';
    $title = $_POST["title"] ?? '';
    $other_title = $_POST["other_title"] ?? '';
    $qualification = $_POST["qualification"] ?? '';
    $specialization = $_POST["specialization"] ?? '';
    $stream = $_POST["stream"] ?? '';
    $course = $_POST["course"] ?? '';
    $passing_year = $_POST["passing_year"] ?? '';
    $membership_type = $_POST["membership_type"] ?? '';
    $password = $_POST["password"] ?? '';

    // Save files
    $profile_pic = saveFile("profile_pic", $uploadDir);
    $aadhaar_front = saveFile("aadhaar_front", $uploadDir);
    $aadhaar_back = saveFile("aadhaar_back", $uploadDir);

    // Insert into DB
    $sql = "INSERT INTO users(name,email,contact,occupation,organization,title,other_title,qualification,specialization,stream,course,passing_year,membership_type,password,profile_pic,aadhaar_front,aadhaar_back)
            VALUES('$name','$email','$contact','$occupation','$organization','$title','$other_title','$qualification','$specialization','$stream','$course','$passing_year','$membership_type','$password','$profile_pic','$aadhaar_front','$aadhaar_back')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success"=>true,"message"=>"Registration successful! You can login now."]);
    } else {
        echo json_encode(["success"=>false,"message"=>"Error: ".$conn->error]);
    }
}
$conn->close();
?>
