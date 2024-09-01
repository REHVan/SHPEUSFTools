DO $$
DECLARE 
    newUserId INT;
    admin_group_id INT;
BEGIN

    SELECT id INTO newUserId FROM "users" WHERE email = '"SHPETech@gmail.com"';

    -- Find Admin Group
    SELECT id INTO admin_group_id FROM "Group" WHERE name = 'Admin';

    -- Assign New User to Admin Group
    INSERT INTO UserGroup (user_id, group_id)
    VALUES (newUserId, admin_group_id);
END $$;
