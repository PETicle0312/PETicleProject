using UnityEngine;

public class ObstacleSpawner : MonoBehaviour
{
    public GameObject[] obstaclePrefabs;
    public float spawnInterval = 2f;
    public float minX = -3f;
    public float maxX = 3f;
    public float spawnY = 4.5f;


    void Start()
    {
        InvokeRepeating("SpawnObstacle", 1f, spawnInterval);
    }

    void SpawnObstacle()
    {
        float randomX = Random.Range(minX, maxX);
        Vector3 spawnPos = new Vector3(randomX, spawnY, 0);

        int index = Random.Range(0, obstaclePrefabs.Length);

        // ��ֹ� ���� ��, ��ȯ�� �޾ƿ���
        GameObject newObstacle = Instantiate(obstaclePrefabs[index], spawnPos, Quaternion.identity);

        // �ӵ� ���� (��: 2.0 ~ 5.0 ���� ����)
        float randomSpeed = Random.Range(2.0f, 5.0f);

        // ObstacleFall ��ũ��Ʈ���� fallSpeed ���� ����
        ObstacleFall fallScript = newObstacle.GetComponent<ObstacleFall>();
        if (fallScript != null)
        {
            fallScript.fallSpeed = randomSpeed;
        }
    }
}

