using UnityEngine;

public class BottleMovement : MonoBehaviour
{
    public float moveSpeed = 3f;

    void Update()
    {
        transform.Translate(Vector3.left * moveSpeed * Time.deltaTime);

        if (transform.position.x < -10f)  
        {
            Destroy(gameObject);
        }
    }
}
