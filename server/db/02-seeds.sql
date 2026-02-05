INSERT INTO users (name, email, password) VALUES 
('Elvis Presley', 'quimica@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Bon Scott', 'ingles@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Jimmy Page', 'portugues@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Lemmy Kilmister', 'geografia@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Tony Iomi', 'historia@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Bruce Dickinson', 'fisica@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Ozzy Osbourne', 'matematica@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq'),
('Axl Rose', 'biologia@fiap.com', '$2a$08$N8d0rJpePiZsBmuJz776oe.3gIxojjIDNdHN5ZwluV/cwtpHyjEJq')
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
    subjects text[] := ARRAY['Química', 'Inglês', 'Português', 'Geografia', 'História', 'Física', 'Matemática', 'Biologia'];
    subj text;
    q_index integer;
    alt_index integer;
    new_question_id uuid;
    is_right boolean;
    alt_text text;
BEGIN
    FOREACH subj IN ARRAY subjects
    LOOP
        FOR q_index IN 1..5 LOOP
            
            INSERT INTO questions (statement, subject)
            VALUES (
                'Questão simulada ' || q_index || ' de ' || subj || ': Esta é uma pergunta de exemplo para testar o banco de dados. Qual a alternativa correta?',
                subj
            )
            RETURNING id INTO new_question_id;

            FOR alt_index IN 1..5 LOOP
                is_right := (alt_index = 3);
                
                alt_text := 'Alternativa ' || chr(64 + alt_index); 

                INSERT INTO alternatives (text, is_correct, question_id)
                VALUES (alt_text, is_right, new_question_id);
            END LOOP;

        END LOOP;
    END LOOP;
END $$;