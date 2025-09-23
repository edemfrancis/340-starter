-- Insert into account
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1roM@n'
    ) -- Update the account_type to Admin
UPDATE public.account
SET account_type = 'Admin'
Where account_id = 1 -- Deleted Tony stark details
DELETE FROM public.account
WHERE account_firstname = 'Tony'
    and account_lastname = 'Stark' -- Replace function used in replace some words in a sentence
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10 -- Using inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport' -- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns using a single query
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');