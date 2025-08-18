using UnityEngine;
using UnityEngine.SocialPlatforms.Impl;

public class GoldPointMovement : MonoBehaviour
{
    public float moveSpeed = 3f;
    public float destroyX = -10f; // ȭ�� ���� ����� ��ġ

    void Update()
    {
        transform.Translate(Vector3.left * moveSpeed * Time.deltaTime);

        if (transform.position.x < destroyX)
        {
            Destroy(gameObject);
        }
    }
}
