CREATE OR REPLACE FUNCTION create_default_income_labels() 
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$ 
BEGIN 
    INSERT INTO "income_label" (user_id, category_id, name) 
    SELECT NEW.id, ic.id, 'None'
    FROM "income_category" ic;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_income_labels
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION create_default_income_labels()