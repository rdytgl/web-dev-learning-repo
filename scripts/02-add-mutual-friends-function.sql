-- Function to get mutual friends suggestions
CREATE OR REPLACE FUNCTION get_mutual_friends_suggestions(current_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  bio TEXT,
  mutual_friends_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.username,
    p.display_name,
    p.bio,
    COUNT(DISTINCT f2.user_id) as mutual_friends_count
  FROM profiles p
  JOIN friendships f2 ON (p.id = f2.friend_id OR p.id = f2.user_id)
  JOIN friendships f1 ON (
    (f1.user_id = current_user_id AND f1.friend_id = f2.user_id AND f2.friend_id = p.id) OR
    (f1.friend_id = current_user_id AND f1.user_id = f2.user_id AND f2.friend_id = p.id) OR
    (f1.user_id = current_user_id AND f1.friend_id = f2.friend_id AND f2.user_id = p.id) OR
    (f1.friend_id = current_user_id AND f1.user_id = f2.friend_id AND f2.user_id = p.id)
  )
  WHERE p.id != current_user_id
    AND f1.status = 'accepted'
    AND f2.status = 'accepted'
    AND p.id NOT IN (
      SELECT CASE 
        WHEN user_id = current_user_id THEN friend_id 
        ELSE user_id 
      END 
      FROM friendships 
      WHERE (user_id = current_user_id OR friend_id = current_user_id)
    )
  GROUP BY p.id, p.username, p.display_name, p.bio
  HAVING COUNT(DISTINCT f2.user_id) > 0
  ORDER BY mutual_friends_count DESC, p.display_name
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
