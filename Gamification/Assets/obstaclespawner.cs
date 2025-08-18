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

        // 장애물 생성 후, 반환값 받아오기
        GameObject newObstacle = Instantiate(obstaclePrefabs[index], spawnPos, Quaternion.identity);

        // 속도 설정 (예: 2.0 ~ 5.0 사이 랜덤)
        float randomSpeed = Random.Range(2.0f, 5.0f);

        // ObstacleFall 스크립트에서 fallSpeed 변수 설정
        ObstacleFall fallScript = newObstacle.GetComponent<ObstacleFall>();
        if (fallScript != null)
        {
            fallScript.fallSpeed = randomSpeed;
        }
    }
}

