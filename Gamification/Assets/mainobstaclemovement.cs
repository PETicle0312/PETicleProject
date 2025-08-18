using UnityEngine;

public class MainObstacleMovement : MonoBehaviour
{
    public float moveSpeed = 3f;

    void Update()
    {
        // 장애물이 왼쪽으로 이동
        transform.Translate(Vector3.left * moveSpeed * Time.deltaTime);

        // 화면을 벗어났다면 사라지게 하는 조건 추가
        if (transform.position.x < -10f)  // 화면 왼쪽 끝을 넘어갔을 때
        {
            Destroy(gameObject);  // 장애물 삭제
        }
    }

    // 충돌 감지 코드
    void OnCollisionEnter2D(Collision2D collision)
    {
        Debug.Log("충돌됨: " + collision.gameObject.name);
    }
}
