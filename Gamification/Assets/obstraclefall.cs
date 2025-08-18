using UnityEngine;

public class ObstacleFall : MonoBehaviour
{
    public float fallSpeed = 2.0f;

    void Update()
    {
        transform.Translate(Vector3.down * fallSpeed * Time.deltaTime);
    }

    // Ʈ���� �浹 ���� �Լ�
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("ground") || other.CompareTag("Player"))
        {
            Destroy(gameObject); // ��ֹ� ����
        }

        if (other.CompareTag("mainobstacle"))  // �������뿡 ������
        {
            Destroy(gameObject);  // ��ֹ� ����
        }
    }

}


