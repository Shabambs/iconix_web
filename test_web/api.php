<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit(0);
}

$data_dir = __DIR__ . '/data';
if (!file_exists($data_dir)) {
    mkdir($data_dir, 0777, true);
}

$members_file = $data_dir . '/members.json';
$settings_file = $data_dir . '/settings.json';

// Default initial settings
$default_settings = [
    'admin_username' => 'admin',
    'admin_password' => 'admin123',
    'require_approval' => true,
    'discord_client_id' => '',
    'discord_client_secret' => '',
    'discord_redirect_uri' => ''
];

// Load Settings
if (!file_exists($settings_file)) {
    file_put_contents($settings_file, json_encode($default_settings, JSON_PRETTY_PRINT));
    $settings = $default_settings;
} else {
    $settings = array_merge(
        $default_settings,
        json_decode(file_get_contents($settings_file), true) ?: []
    );
}

if (getenv('DISCORD_CLIENT_ID') !== false && getenv('DISCORD_CLIENT_ID') !== '') {
    $settings['discord_client_id'] = getenv('DISCORD_CLIENT_ID');
}

if (getenv('DISCORD_CLIENT_SECRET') !== false && getenv('DISCORD_CLIENT_SECRET') !== '') {
    $settings['discord_client_secret'] = getenv('DISCORD_CLIENT_SECRET');
}

if (getenv('DISCORD_REDIRECT_URI') !== false && getenv('DISCORD_REDIRECT_URI') !== '') {
    $settings['discord_redirect_uri'] = getenv('DISCORD_REDIRECT_URI');
}

// Default initial members
$default_members = [
    [
        'id' => 'mem-1',
        'discordId' => '990000000000000001',
        'displayName' => 'Sakura',
        'handle' => '@skrwr1d',
        'avatar' => 'assets/images/default_avatar.svg',
        'status' => 'dnd',
        'statusText' => 'Do Not Disturb',
        'bio' => '*rise | 🖤🎶',
        'badges' => ['ICONIX', '1CNX', 'Verified Creator'],
        'links' => ['ig' => 'https://instagram.com/skrwr1d', 'yt' => 'https://youtube.com', 'tt' => 'https://tiktok.com/@sakurawrld', 'dc' => 'skrwr1d', 'sp' => 'https://spotify.com', 'tw' => 'https://twitch.tv', 'fb' => ''],
        'musicUrl' => 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        'approved' => true,
        'createdAt' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 'mem-2',
        'discordId' => '990000000000000002',
        'displayName' => 'Brooke',
        'handle' => '@brooke_vibes',
        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        'status' => 'online',
        'statusText' => 'Online',
        'bio' => 'fake it till you make it',
        'badges' => ['ICONIX', 'Vibe'],
        'links' => ['ig' => 'https://instagram.com', 'yt' => '', 'tt' => 'https://tiktok.com', 'dc' => 'brooke#1111', 'sp' => '', 'tw' => '', 'fb' => ''],
        'musicUrl' => 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
        'approved' => true,
        'createdAt' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 'mem-3',
        'discordId' => '990000000000000003',
        'displayName' => 'Dior',
        'handle' => '@dior_mode',
        'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        'status' => 'idle',
        'statusText' => 'Idle',
        'bio' => 'by any means necessary',
        'badges' => ['ICONIX', 'Lead'],
        'links' => ['ig' => 'https://instagram.com', 'yt' => 'https://youtube.com', 'tt' => '', 'dc' => 'dior#9999', 'sp' => '', 'tw' => '', 'fb' => ''],
        'musicUrl' => 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7e090.mp3?filename=aesthetic-night-lofi-124976.mp3',
        'approved' => true,
        'createdAt' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 'mem-4',
        'discordId' => '990000000000000004',
        'displayName' => 'Mandy',
        'handle' => '@mandy_empty',
        'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        'status' => 'online',
        'statusText' => 'Online',
        'bio' => 'no thoughts, head empty',
        'badges' => ['ICONIX', 'Artist'],
        'links' => ['ig' => 'https://instagram.com', 'yt' => '', 'tt' => '', 'dc' => 'mandy#0001', 'sp' => '', 'tw' => '', 'fb' => ''],
        'musicUrl' => 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
        'approved' => true,
        'createdAt' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 'mem-5',
        'discordId' => '990000000000000005',
        'displayName' => 'Tino',
        'handle' => '@tino_questions',
        'avatar' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
        'status' => 'dnd',
        'statusText' => 'Do Not Disturb',
        'bio' => 'so many questions in my head',
        'badges' => ['ICONIX', 'Thinker'],
        'links' => ['ig' => 'https://instagram.com', 'yt' => '', 'tt' => '', 'dc' => 'tino#7777', 'sp' => '', 'tw' => '', 'fb' => ''],
        'musicUrl' => 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
        'approved' => true,
        'createdAt' => date('Y-m-d H:i:s')
    ],
    [
        'id' => 'mem-6',
        'discordId' => '990000000000000006',
        'displayName' => 'Jopay',
        'handle' => '@jopay_cute',
        'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        'status' => 'dnd',
        'statusText' => 'Do Not Disturb',
        'bio' => 'SAKIN KA LANG LULUPAYPAY :P',
        'badges' => ['ICONIX', 'Queen'],
        'links' => ['ig' => 'https://instagram.com', 'yt' => '', 'tt' => 'https://tiktok.com', 'dc' => 'jopay#8888', 'sp' => '', 'tw' => '', 'fb' => ''],
        'musicUrl' => 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7e090.mp3?filename=aesthetic-night-lofi-124976.mp3',
        'approved' => true,
        'createdAt' => date('Y-m-d H:i:s')
    ]
];

// Load Members
if (!file_exists($members_file)) {
    file_put_contents($members_file, json_encode($default_members, JSON_PRETTY_PRINT));
    $members = $default_members;
} else {
    $members = json_decode(file_get_contents($members_file), true) ?: [];
}

function save_members($members, $members_file) {
    // Compact JSON (no pretty print) saves ~30% file size
    file_put_contents($members_file, json_encode($members, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

function save_settings($settings, $settings_file) {
    file_put_contents($settings_file, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/**
 * XAMPP-compatible cURL helper.
 * Fixes "Could not resolve host" on Windows by forcing IPv4 + explicit DNS.
 */
function makeCurlRequest($url, $method = 'GET', $postData = null, $headers = []) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 10,
        // Force IPv4 — IPv6 DNS often fails on local XAMPP/Windows
        CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,
        // Use Google Public DNS to resolve hostnames
        CURLOPT_DNS_SERVERS    => '8.8.8.8,8.8.4.4',
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_USERAGENT      => 'ICONIX-Bot/1.0 (PHP/' . PHP_VERSION . ')',
    ]);

    if ($method === 'POST' && $postData !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($postData) ? http_build_query($postData) : $postData);
    }

    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }

    $result = curl_exec($ch);
    $errno  = curl_errno($ch);
    $error  = curl_error($ch);
    $code   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['body' => $result, 'code' => $code, 'errno' => $errno, 'error' => $error];
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

switch ($action) {
    case 'upload_file':
        if (!isset($_FILES['file'])) {
            echo json_encode(['success' => false, 'message' => 'No file uploaded.']);
            exit;
        }

        $file = $_FILES['file'];
        $upload_dir = __DIR__ . '/assets/uploads/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9.\-_]/', '', basename($file['name']));
        $target_path = $upload_dir . $filename;

        if (move_uploaded_file($file['tmp_name'], $target_path)) {
            echo json_encode([
                'success' => true,
                'url' => 'assets/uploads/' . $filename,
                'message' => 'File uploaded successfully.'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save file.']);
        }
        exit;

    // 1. GET PUBLIC MEMBERS (Approved members only + current user's profile if pending)
    case 'get_members':
        $current_user_id = $_SESSION['user_id'] ?? null;
        $is_admin = $_SESSION['is_admin'] ?? false;

        $public_members = [];
        foreach ($members as $m) {
            if ($is_admin || !empty($m['approved']) || ($current_user_id && $m['id'] === $current_user_id)) {
                $public_members[] = $m;
            }
        }

        echo json_encode([
            'success' => true,
            'members' => $public_members,
            'session' => [
                'logged_in' => !empty($_SESSION['user_id']),
                'user_id' => $_SESSION['user_id'] ?? null,
                'user' => $_SESSION['user_data'] ?? null,
                'is_admin' => !empty($_SESSION['is_admin'])
            ],
            'require_approval' => $settings['require_approval']
        ]);
        break;

    // 2. GET CURRENT SESSION STATUS
    case 'get_session':
        echo json_encode([
            'success' => true,
            'logged_in' => !empty($_SESSION['user_id']),
            'user_id' => $_SESSION['user_id'] ?? null,
            'user' => $_SESSION['user_data'] ?? null,
            'is_admin' => !empty($_SESSION['is_admin'])
        ]);
        break;

    // 3. DISCORD LOGIN / LINK ACCOUNT & REGISTRATION
    case 'discord_login':
        $mode = trim($input['mode'] ?? 'register');
        $raw_tag = trim($input['handle'] ?? $input['discordTag'] ?? '');
        $discord_tag = !empty($raw_tag) ? (str_starts_with($raw_tag, '@') ? $raw_tag : ('@' . $raw_tag)) : '';
        $clean_tag = strtolower(ltrim($discord_tag, '@'));
        $display_name = trim($input['displayName'] ?? '');
        $avatar = trim($input['avatar'] ?? 'assets/images/default_avatar.svg');
        $discord_id = trim($input['discordId'] ?? '');

        // Search existing member index
        $found_index = -1;
        foreach ($members as $idx => $m) {
            $m_handle_clean = strtolower(ltrim($m['handle'] ?? '', '@'));
            if ((!empty($discord_id) && !empty($m['discordId']) && $m['discordId'] === $discord_id) || 
                (!empty($clean_tag) && $m_handle_clean === $clean_tag)) {
                $found_index = $idx;
                break;
            }
        }

        if ($mode === 'login_only') {
            if (empty($raw_tag)) {
                echo json_encode(['success' => false, 'message' => 'Please enter your Discord Tag / Handle.']);
                exit;
            }

            if ($found_index !== -1) {
                $member = &$members[$found_index];
                $_SESSION['user_id'] = $member['id'];
                $_SESSION['user_data'] = $member;
                $_SESSION['is_admin'] = false;

                echo json_encode([
                    'success' => true,
                    'message' => "Welcome back, {$member['displayName']}! Logged in successfully.",
                    'is_new' => false,
                    'member' => $member,
                    'approved' => !empty($member['approved'])
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Hindi mahanap ang account na '$raw_tag'. Mangyaring pumunta sa 'New Registration' tab para mag-submit ng registration."
                ]);
            }
            exit;
        }

        // REGISTER NEW MEMBER MODE
        if (empty($display_name) || empty($raw_tag)) {
            echo json_encode(['success' => false, 'message' => 'Display name and Discord handle are required for registration.']);
            exit;
        }

        if ($found_index !== -1) {
            // Member already exists, log in
            $member = &$members[$found_index];
            $_SESSION['user_id'] = $member['id'];
            $_SESSION['user_data'] = $member;
            $_SESSION['is_admin'] = false;

            echo json_encode([
                'success' => true,
                'message' => 'Ang iyong account ay rehistrado na at nakalogin na!',
                'is_new' => false,
                'member' => $member,
                'approved' => !empty($member['approved'])
            ]);
        } else {
            // New Registration
            $new_id = 'mem-' . (count($members) + 1) . '-' . rand(100, 999);
            $auto_approve = !$settings['require_approval'];

            $new_member = [
                'id' => $new_id,
                'discordId' => $discord_id ?: ('dc_' . time() . '_' . rand(100, 999)),
                'displayName' => $display_name,
                'handle' => $discord_tag,
                'avatar' => $avatar ?: 'assets/images/default_avatar.svg',
                'status' => 'online',
                'statusText' => 'Online',
                'bio' => trim($input['bio'] ?? 'Hello! I submitted my Discord registration.'),
                'badges' => ['Discord Linked', 'New Member'],
                'links' => [
                    'ig' => $input['links']['ig'] ?? '',
                    'yt' => $input['links']['yt'] ?? '',
                    'tt' => $input['links']['tt'] ?? '',
                    'dc' => $discord_tag,
                    'sp' => '',
                    'tw' => $input['links']['tw'] ?? '',
                    'fb' => ''
                ],
                'musicUrl' => $input['musicUrl'] ?? '',
                'approved' => $auto_approve,
                'createdAt' => date('Y-m-d H:i:s')
            ];

            $members[] = $new_member;
            save_members($members, $members_file);

            $_SESSION['user_id'] = $new_id;
            $_SESSION['user_data'] = $new_member;
            $_SESSION['is_admin'] = false;

            echo json_encode([
                'success' => true,
                'message' => $auto_approve ? 'Registration submitted & approved!' : 'Registration submitted! Waiting for Admin approval.',
                'is_new' => true,
                'member' => $new_member,
                'approved' => $auto_approve
            ]);
        }
        break;

    // DISCORD OAUTH2 REDIRECT
    case 'discord_oauth_redirect':
        $client_id = $settings['discord_client_id'] ?? '';
        $redirect_uri = $settings['discord_redirect_uri'] ?? '';
        $source = $_GET['source'] ?? 'index';
        
        if (empty($client_id) || empty($redirect_uri)) {
            $redirect_target = ($source === 'join') ? 'join.html' : 'index.html';
            header("Location: {$redirect_target}?login_error=Missing+Discord+App+Credentials");
            exit;
        }

        $discord_url = "https://discord.com/api/oauth2/authorize" . 
                       "?client_id=" . urlencode($client_id) . 
                       "&redirect_uri=" . urlencode($redirect_uri) . 
                       "&response_type=code" . 
                       "&scope=identify" .
                       "&state=" . urlencode($source);

        header("Location: $discord_url");
        exit;

    // DISCORD OAUTH2 CALLBACK
    case 'discord_callback':
        $code = $_GET['code'] ?? '';
        $state = $_GET['state'] ?? 'index';
        $redirect_target = ($state === 'join') ? 'join.html' : 'index.html';

        if (empty($code)) {
            header("Location: {$redirect_target}?login_error=Authorization+Failed");
            exit;
        }

        $client_id = $settings['discord_client_id'] ?? '';
        $client_secret = $settings['discord_client_secret'] ?? '';
        $redirect_uri = $settings['discord_redirect_uri'] ?? '';

        // 1. Exchange code for token
        $token_url  = 'https://discord.com/api/oauth2/token';
        $token_data = [
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'grant_type'    => 'authorization_code',
            'code'          => $code,
            'redirect_uri'  => $redirect_uri
        ];

        $tokenRes = makeCurlRequest($token_url, 'POST', $token_data, [
            'Content-Type: application/x-www-form-urlencoded'
        ]);

        if ($tokenRes['errno']) {
            header("Location: {$redirect_target}?login_error=" . urlencode('cURL Error: ' . $tokenRes['error']));
            exit;
        }
        if ($tokenRes['code'] != 200) {
            header("Location: {$redirect_target}?login_error=" . urlencode('Failed to get token (HTTP ' . $tokenRes['code'] . ')'));
            exit;
        }

        $token_response = json_decode($tokenRes['body'], true);
        $access_token   = $token_response['access_token'] ?? null;

        if (!$access_token) {
            header('Location: index.html?login_error=Invalid+token+response');
            exit;
        }

        // 2. Fetch User Profile
        $userRes = makeCurlRequest('https://discord.com/api/users/@me', 'GET', null, [
            "Authorization: Bearer {$access_token}"
        ]);

        if ($userRes['errno'] || $userRes['body'] === false) {
            header("Location: {$redirect_target}?login_error=Failed+to+fetch+user+data");
            exit;
        }

        $discord_user = json_decode($userRes['body'], true);
        $discord_id = $discord_user['id'];
        $username = $discord_user['username'];
        $global_name = $discord_user['global_name'] ?? $username;
        $avatar_hash = $discord_user['avatar'] ?? null;
        
        $avatar_url = 'assets/images/default_avatar.svg';
        if ($avatar_hash) {
            $ext = str_starts_with($avatar_hash, 'a_') ? 'gif' : 'png';
            $avatar_url = "https://cdn.discordapp.com/avatars/{$discord_id}/{$avatar_hash}.{$ext}";
        }

        $banner_hash = $discord_user['banner'] ?? null;
        $banner_url = '';
        if ($banner_hash) {
            $ext = str_starts_with($banner_hash, 'a_') ? 'gif' : 'png';
            $banner_url = "https://cdn.discordapp.com/banners/{$discord_id}/{$banner_hash}.{$ext}";
        }

        $decoration = $discord_user['avatar_decoration_data'] ?? null;
        $decoration_url = '';
        if ($decoration && isset($decoration['asset'])) {
            $decoration_url = "https://cdn.discordapp.com/avatar-decoration-presets/{$decoration['asset']}.png";
        }

        // Find existing user by ID
        $found_index = -1;
        foreach ($members as $idx => $m) {
            if (!empty($m['discordId']) && $m['discordId'] === $discord_id) {
                $found_index = $idx;
                break;
            }
        }

        if ($found_index !== -1) {
            // Update existing user
            $members[$found_index]['displayName'] = $global_name;
            $members[$found_index]['handle'] = '@' . $username;
            $members[$found_index]['avatar'] = $avatar_url;
            if ($banner_url) $members[$found_index]['bannerUrl'] = $banner_url;
            if ($decoration_url) $members[$found_index]['decorationUrl'] = $decoration_url;
            
            save_members($members, $members_file);
            
            $_SESSION['user_id'] = $members[$found_index]['id'];
            $_SESSION['user_data'] = $members[$found_index];
            $_SESSION['is_admin'] = false;
            
            header("Location: {$redirect_target}?login_success=Welcome+Back");
        } else {
            // Register New User
            $new_id = 'mem-' . (count($members) + 1) . '-' . rand(100, 999);
            $auto_approve = !$settings['require_approval'];
            
            $new_member = [
                'id' => $new_id,
                'discordId' => $discord_id,
                'displayName' => $global_name,
                'handle' => '@' . $username,
                'avatar' => $avatar_url,
                'bannerUrl' => $banner_url,
                'decorationUrl' => $decoration_url,
                'status' => 'online', // placeholder
                'statusText' => 'Online',
                'bio' => 'Imported via Discord Login',
                'badges' => ['Discord Linked', 'New Member'],
                'links' => [
                    'dc' => '@' . $username
                ],
                'musicUrl' => '',
                'approved' => $auto_approve,
                'createdAt' => date('Y-m-d H:i:s')
            ];
            
            $members[] = $new_member;
            save_members($members, $members_file);
            
            $_SESSION['user_id'] = $new_id;
            $_SESSION['user_data'] = $new_member;
            $_SESSION['is_admin'] = false;
            
            if ($auto_approve) {
                header("Location: {$redirect_target}?login_success=Registration+Approved");
            } else {
                header("Location: {$redirect_target}?login_success=Registration+Submitted+For+Approval");
            }
        }
        exit;

    // 4. UPDATE MEMBER PROFILE (User can only edit OWN profile unless Admin)
    case 'update_profile':
        $target_id = trim($input['id'] ?? '');
        $current_user_id = $_SESSION['user_id'] ?? null;
        $is_admin = !empty($_SESSION['is_admin']);

        if (!$current_user_id && !$is_admin) {
            echo json_encode(['success' => false, 'message' => 'You must be logged in to edit profiles.']);
            exit;
        }

        // PERMISSION CHECK: Regular user can ONLY edit their own profile!
        if (!$is_admin && $current_user_id !== $target_id) {
            echo json_encode(['success' => false, 'message' => 'Permission Denied! You can only edit your own profile card.']);
            exit;
        }

        $found = false;
        foreach ($members as $idx => &$m) {
            if ($m['id'] === $target_id) {
                $m['displayName'] = trim($input['displayName'] ?? $m['displayName']);
                $m['handle'] = trim($input['handle'] ?? $m['handle']);
                $m['avatar'] = trim($input['avatar'] ?? $m['avatar']);
                $m['status'] = trim($input['status'] ?? $m['status']);
                $m['statusText'] = trim($input['statusText'] ?? $m['statusText']);
                $m['bio'] = trim($input['bio'] ?? $m['bio']);
                if (isset($input['badges'])) {
                    $m['badges'] = is_array($input['badges']) ? $input['badges'] : array_map('trim', explode(',', $input['badges']));
                }
                if (isset($input['links'])) {
                    $m['links'] = array_merge($m['links'] ?? [], $input['links']);
                }
                if (isset($input['musicUrl'])) {
                    $m['musicUrl'] = trim($input['musicUrl']);
                }
                if (isset($input['bannerUrl'])) {
                    $m['bannerUrl'] = trim($input['bannerUrl']);
                }

                // Update session if user edited their own profile
                if ($current_user_id === $target_id) {
                    $_SESSION['user_data'] = $m;
                }

                $found = true;
                break;
            }
        }

        if ($found) {
            save_members($members, $members_file);
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Member profile not found.']);
        }
        break;

    // 5. ADMIN LOGIN
    case 'admin_login':
        $user = trim($input['username'] ?? '');
        $pass = trim($input['password'] ?? '');
        
        $expected_user = $settings['admin_username'] ?? 'admin';
        
        if ($user === $expected_user && $pass === $settings['admin_password']) {
            $_SESSION['is_admin'] = true;
            $_SESSION['admin_user'] = 'Admin';
            echo json_encode([
                'success' => true,
                'message' => 'Admin authentication successful!',
                'is_admin' => true
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Incorrect Admin Username or Password.']);
        }
        break;

    // 6. ADMIN GET ALL MEMBERS & STATS
    case 'admin_get_all':
        if (empty($_SESSION['is_admin'])) {
            echo json_encode(['success' => false, 'message' => 'Admin authorization required.']);
            exit;
        }

        $pending_count = 0;
        $approved_count = 0;
        foreach ($members as $m) {
            if (!empty($m['approved'])) {
                $approved_count++;
            } else {
                $pending_count++;
            }
        }

        echo json_encode([
            'success' => true,
            'members' => $members,
            'stats' => [
                'total' => count($members),
                'approved' => $approved_count,
                'pending' => $pending_count
            ],
            'settings' => [
                'require_approval' => $settings['require_approval'],
                'discord_client_id' => $settings['discord_client_id'],
                'discord_redirect_uri' => $settings['discord_redirect_uri']
            ]
        ]);
        break;

    // 7. ADMIN APPROVE MEMBER
    case 'admin_approve':
        if (empty($_SESSION['is_admin'])) {
            echo json_encode(['success' => false, 'message' => 'Admin authorization required.']);
            exit;
        }

        $target_id = trim($input['id'] ?? '');
        $found = false;
        foreach ($members as &$m) {
            if ($m['id'] === $target_id) {
                $m['approved'] = true;
                $found = true;
                break;
            }
        }

        if ($found) {
            save_members($members, $members_file);
            echo json_encode(['success' => true, 'message' => 'Member registration APPROVED! Profile is now live on the site.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Member not found.']);
        }
        break;

    // 8. ADMIN REJECT / DELETE MEMBER
    case 'admin_reject':
    case 'delete_member':
        $target_id = trim($input['id'] ?? '');
        $current_user_id = $_SESSION['user_id'] ?? null;
        $is_admin = !empty($_SESSION['is_admin']);

        if (!$is_admin && $current_user_id !== $target_id) {
            echo json_encode(['success' => false, 'message' => 'Permission Denied! You cannot delete this member.']);
            exit;
        }

        $new_members = array_values(array_filter($members, function($m) use ($target_id) {
            return $m['id'] !== $target_id;
        }));

        save_members($new_members, $members_file);

        if ($current_user_id === $target_id) {
            session_destroy();
        }

        echo json_encode(['success' => true, 'message' => 'Member removed successfully.']);
        break;

    // 9. ADMIN UPDATE SETTINGS
    case 'admin_update_settings':
        if (empty($_SESSION['is_admin'])) {
            echo json_encode(['success' => false, 'message' => 'Admin authorization required.']);
            exit;
        }

        if (isset($input['require_approval'])) {
            $settings['require_approval'] = (bool)$input['require_approval'];
        }
        if (!empty($input['admin_username'])) {
            $settings['admin_username'] = trim($input['admin_username']);
        }
        if (!empty($input['admin_password'])) {
            $settings['admin_password'] = trim($input['admin_password']);
        }
        if (isset($input['discord_client_id'])) {
            $settings['discord_client_id'] = trim($input['discord_client_id']);
        }
        if (!empty($input['discord_client_secret'])) {
            $settings['discord_client_secret'] = trim($input['discord_client_secret']);
        }
        if (isset($input['discord_redirect_uri'])) {
            $settings['discord_redirect_uri'] = trim($input['discord_redirect_uri']);
        }

        save_settings($settings, $settings_file);
        echo json_encode(['success' => true, 'message' => 'Admin settings saved successfully!']);
        break;

    // 10. LOGOUT
    case 'logout':
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action parameter.']);
        break;
}
