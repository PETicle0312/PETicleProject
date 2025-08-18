using UnityEngine;

public class ObstacleFall : MonoBehaviour
{
    public float fallSpeed = 2.0f;

    void Update()
    {
        transform.Translate(Vector3.down * fallSpeed * Time.deltaTime);
    }

    // 트리거 충돌 감지 함수
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("ground") || other.CompareTag("Player"))
        {
            Destroy(gameObject); // 장애물 제거
        }

        if (other.CompareTag("mainobstacle"))  // 쓰레기통에 닿으면
        {
            Destroy(gameObject);  // 장애물 제거
        }
    }

}


