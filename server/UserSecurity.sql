-- Variables
DO $$ 
DECLARE 
    admin_user_id INT;
    admin_group_id INT;
    mentor_group_id INT;
    mentee_group_id INT;
    default_group_id INT;
    rights_view_id INT;
    rights_edit_id INT;
    rights_save_id INT;
    section_matching_id INT;
    section_points_id INT;
    section_task_id INT;
    section_form_id INT;
    section_external_id INT;
    section_marketing_id INT;
    admin_group_view_right INT;
    admin_group_edit_right INT;
    admin_group_save_right INT;
    admin_group_admin_right INT;
    mentor_group_view_right INT;
    mentor_group_edit_right INT;
    mentor_group_save_right INT;
    mentee_group_view_right INT;
    mentee_group_edit_right INT;
    mentee_group_save_right INT;
    default_group_view_right INT;
    default_group_edit_right INT;
    default_group_save_right INT;

BEGIN
    -- Insert Admin User
    INSERT INTO Users (firstname, lastname, orgname, email, password)
    VALUES ('External', 'External', 'University of South Florida', 'External@gmail.com', '$2y$10$kguufFL/fJiNIxtXOhE7m.6JcsdVzF7rv14QxlCO/E6MF./0Qc34u')
    RETURNING id INTO admin_user_id;

    -- Insert Groups
    INSERT INTO "Group" (name) VALUES ('Admin') RETURNING id INTO admin_group_id;
    INSERT INTO "Group" (name) VALUES ('Mentor') RETURNING id INTO mentor_group_id;
    INSERT INTO "Group" (name) VALUES ('Mentee') RETURNING id INTO mentee_group_id;
    INSERT INTO "Group" (name) VALUES ('Default') RETURNING id INTO default_group_id;

    -- Assign Admin User to Admin Group
    INSERT INTO UserGroup (user_id, group_id)
    VALUES (admin_user_id, admin_group_id);

    -- Insert Sections
    INSERT INTO Section (name) VALUES ('Matching') RETURNING id INTO section_matching_id;
    INSERT INTO Section (name) VALUES ('Points') RETURNING id INTO section_points_id;
    INSERT INTO Section (name) VALUES ('Task') RETURNING id INTO section_task_id;
    INSERT INTO Section (name) VALUES ('Form') RETURNING id INTO section_form_id;
    INSERT INTO Section (name) VALUES ('External') RETURNING id INTO section_external_id;
    INSERT INTO Section (name) VALUES ('Marketing') RETURNING id INTO section_marketing_id;

    -- Insert Rights
    INSERT INTO Rights (name) VALUES ('view') RETURNING id INTO rights_view_id;
    INSERT INTO Rights (name) VALUES ('edit') RETURNING id INTO rights_edit_id;
    INSERT INTO Rights (name) VALUES ('save') RETURNING id INTO rights_save_id;

    -- Admin Group: Full Access
    INSERT INTO GroupRight (group_id, right_id) VALUES (admin_group_id, rights_view_id) RETURNING id INTO admin_group_view_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (admin_group_id, rights_edit_id) RETURNING id INTO admin_group_edit_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (admin_group_id, rights_save_id) RETURNING id INTO admin_group_save_right;


    -- Mentor Group: Limited Access
    INSERT INTO GroupRight (group_id, right_id) VALUES (mentor_group_id, rights_view_id) RETURNING id INTO mentor_group_view_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (mentor_group_id, rights_edit_id) RETURNING id INTO mentor_group_edit_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (mentor_group_id, rights_save_id) RETURNING id INTO mentor_group_save_right;

    INSERT INTO GroupRight (group_id, right_id) VALUES (mentee_group_id, rights_view_id) RETURNING id INTO mentee_group_view_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (mentee_group_id, rights_edit_id) RETURNING id INTO mentee_group_edit_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (mentee_group_id, rights_save_id) RETURNING id INTO mentee_group_save_right;

    -- Default Group: Limited Access
    INSERT INTO GroupRight (group_id, right_id) VALUES (default_group_id, rights_view_id) RETURNING id INTO default_group_view_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (default_group_id, rights_save_id) RETURNING id INTO default_group_edit_right;
    INSERT INTO GroupRight (group_id, right_id) VALUES (default_group_id, rights_save_id) RETURNING id INTO default_group_save_right;


    -- Admin Group: Full Access to All Sections
    INSERT INTO GroupSectionRight (group_right_id, section_id)
    VALUES 
        (admin_group_view_right, section_matching_id),
        (admin_group_view_right, section_points_id),
        (admin_group_view_right, section_task_id),
        (admin_group_view_right, section_form_id),
        (admin_group_view_right, section_external_id),
        (admin_group_view_right, section_marketing_id),
        (admin_group_edit_right, section_matching_id),
        (admin_group_edit_right, section_points_id),
        (admin_group_edit_right, section_task_id),
        (admin_group_edit_right, section_form_id),
        (admin_group_edit_right, section_external_id),
        (admin_group_edit_right, section_marketing_id),
        (admin_group_save_right, section_matching_id),
        (admin_group_save_right, section_points_id),
        (admin_group_save_right, section_task_id),
        (admin_group_save_right, section_form_id),
        (admin_group_save_right, section_external_id),
        (admin_group_save_right, section_marketing_id);

    --Mentee Group
    INSERT INTO GroupSectionRight (group_right_id, section_id)
    VALUES 
        (mentee_group_view_right, section_points_id),
        (mentee_group_view_right, section_task_id),
        (mentee_group_view_right, section_form_id),
        (mentee_group_edit_right, section_task_id),
        (mentee_group_edit_right, section_form_id),
        (mentee_group_save_right, section_task_id),
        (mentee_group_save_right, section_form_id);
    --Mentor Group
    INSERT INTO GroupSectionRight (group_right_id, section_id)
    VALUES 
        (mentor_group_view_right, section_points_id),
        (mentor_group_view_right, section_task_id),
        (mentor_group_view_right, section_form_id),
        (mentor_group_edit_right, section_points_id),
        (mentor_group_edit_right, section_task_id),
        (mentor_group_save_right, section_points_id),
        (mentor_group_save_right, section_task_id);
    --Default Group

    INSERT INTO GroupSectionRight (group_right_id, section_id)
    VALUES 
        (default_group_view_right, section_form_id),
        (default_group_edit_right, section_form_id),
        (default_group_save_right, section_form_id);
END $$;
