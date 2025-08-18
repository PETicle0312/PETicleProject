using UnityEngine;

public class MainObstacleMovement : MonoBehaviour
{
    public float moveSpeed = 3f;

    void Update()
    {
        // ��ֹ��� �������� �̵�
        transform.Translate(Vector3.left * moveSpeed * Time.deltaTime);

        // ȭ���� ����ٸ� ������� �ϴ� ���� �߰�
        if (transform.position.x < -10f)  // ȭ�� ���� ���� �Ѿ�� ��
        {
            Destroy(gameObject);  // ��ֹ� ����
        }
    }

    // �浹 ���� �ڵ�
    void OnCollisionEnter2D(Collision2D collision)
    {
        Debug.Log("�浹��: " + collision.gameObject.name);
    }
}
