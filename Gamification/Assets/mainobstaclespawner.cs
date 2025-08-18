using UnityEngine;

public class MainObstacleSpawner : MonoBehaviour
{
    public GameObject mainObstaclePrefab;
    public float spawnX = 10f;
    public float spawnY = 0f;

    public float minSpawnDelay = 1f;  // 최소 생성 간격
    public float maxSpawnDelay = 3f;  // 최대 생성 간격

    void Start()
    {
        if (mainObstaclePrefab == null)
        {
            Debug.LogError("mainObstaclePrefab이 할당되지 않았습니다!");
            return;
        }

        // 첫 생성 시작
        Invoke(nameof(SpawnObstacle), Random.Range(minSpawnDelay, maxSpawnDelay));
    }

    void SpawnObstacle()
    {
        Vector3 spawnPosition = new Vector3(spawnX, spawnY, 0);
        GameObject newObstacle = Instantiate(mainObstaclePrefab, spawnPosition, Quaternion.identity);

        // 랜덤 속도 설정
        MainObstacleMovement movement = newObstacle.GetComponent<MainObstacleMovement>();
        if (movement != null)
        {
            movement.moveSpeed = Random.Range(2f, 6f);  // 속도 무작위
        }

        // 다음 생성 예약
        float nextDelay = Random.Range(minSpawnDelay, maxSpawnDelay);
        Invoke(nameof(SpawnObstacle), nextDelay);
    }
}
