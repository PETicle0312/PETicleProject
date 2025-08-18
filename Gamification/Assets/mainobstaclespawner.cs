using UnityEngine;

public class MainObstacleSpawner : MonoBehaviour
{
    public GameObject mainObstaclePrefab;
    public float spawnX = 10f;
    public float spawnY = 0f;

    public float minSpawnDelay = 1f;  // �ּ� ���� ����
    public float maxSpawnDelay = 3f;  // �ִ� ���� ����

    void Start()
    {
        if (mainObstaclePrefab == null)
        {
            Debug.LogError("mainObstaclePrefab�� �Ҵ���� �ʾҽ��ϴ�!");
            return;
        }

        // ù ���� ����
        Invoke(nameof(SpawnObstacle), Random.Range(minSpawnDelay, maxSpawnDelay));
    }

    void SpawnObstacle()
    {
        Vector3 spawnPosition = new Vector3(spawnX, spawnY, 0);
        GameObject newObstacle = Instantiate(mainObstaclePrefab, spawnPosition, Quaternion.identity);

        // ���� �ӵ� ����
        MainObstacleMovement movement = newObstacle.GetComponent<MainObstacleMovement>();
        if (movement != null)
        {
            movement.moveSpeed = Random.Range(2f, 6f);  // �ӵ� ������
        }

        // ���� ���� ����
        float nextDelay = Random.Range(minSpawnDelay, maxSpawnDelay);
        Invoke(nameof(SpawnObstacle), nextDelay);
    }
}
