using UnityEngine;
using System.Collections.Generic;

public class BottleSpawner : MonoBehaviour
{
    [Header("프리팹")]
    public GameObject bottlePrefab;
    public GameObject goldPointPrefab;

    [Header("스폰 설정")]
    public float spawnInterval = 1.5f;       // 일반 병 생성 간격
    public float goldSpawnInterval = 8f;     // 골드 병 생성 간격
    public float spawnX = 8f;
    public float xSpacing = 0.6f;

    [Header("Y 위치 설정")]
    public float groundMinY = 1f;
    public float groundMaxY = 1.4f;
    public float jumpMinY = 1.4f;
    public float jumpMaxY = 2.2f;

    private float timer = 0f;
    private float goldTimer = 0f;
    private int patternIndex = 0;
    private List<Vector2> currentPattern = new List<Vector2>();

    void Update()
    {
        // 일반 병 생성
        timer += Time.deltaTime;
        if (timer >= spawnInterval)
        {
            timer = 0f;

            if (patternIndex >= currentPattern.Count)
            {
                GenerateNewPattern();
                patternIndex = 0;
            }

            SpawnBottle(currentPattern[patternIndex]);
            patternIndex++;
        }

        // 골드 포인트 생성
        goldTimer += Time.deltaTime;
        if (goldTimer >= goldSpawnInterval)
        {
            goldTimer = 0f;
            SpawnGoldPointPattern(3);  // 3개 무작위 위치에 생성
        }
    }

    void SpawnBottle(Vector2 pos)
    {
        Instantiate(bottlePrefab, new Vector3(pos.x, pos.y, 0f), Quaternion.identity);
    }

    void SpawnGoldPoint(Vector2 pos)
    {
        if (goldPointPrefab != null)
        {
            Debug.Log("💰 골드 포인트 생성 위치: " + pos);
            Instantiate(goldPointPrefab, new Vector3(pos.x, pos.y, 0f), Quaternion.identity);
        }
        else
        {
            Debug.LogWarning("⚠️ goldPointPrefab이 Inspector에 할당되지 않았습니다.");
        }
    }

    void GenerateNewPattern()
    {
        currentPattern.Clear();
        bool isMountain = Random.value > 0.5f;
        int count = Random.Range(4, 7);

        for (int i = 0; i < count; i++)
        {
            float x = spawnX + i * xSpacing;
            float y;

            if (isMountain)
            {
                float t = (float)i / (count - 1);
                y = Mathf.Sin(t * Mathf.PI) * Random.Range(0.8f, 1.1f) + 1.2f;
            }
            else
            {
                y = Random.Range(groundMinY, groundMaxY);
            }

            currentPattern.Add(new Vector2(x, y));
        }
    }

    void SpawnGoldPointPattern(int count)
    {
        List<float> usedX = new List<float>();

        for (int i = 0; i < count; i++)
        {
            int attempt = 0;
            Vector3 worldPos;

            do
            {
                float viewX = Random.Range(0.1f, 0.9f);
                float viewY = Random.Range(0.4f, 0.8f);

                worldPos = Camera.main.ViewportToWorldPoint(new Vector3(viewX, viewY, 0));
                worldPos.z = 0;

                attempt++;
            } while (usedX.Exists(x => Mathf.Abs(x - worldPos.x) < 1f) && attempt < 10);

            usedX.Add(worldPos.x);

            SpawnGoldPoint(new Vector2(worldPos.x, worldPos.y));  // Vector2로 전달
        }
    }

}
