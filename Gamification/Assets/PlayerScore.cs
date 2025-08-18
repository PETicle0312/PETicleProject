using UnityEngine;
using TMPro;

[RequireComponent(typeof(Collider2D))]
[RequireComponent(typeof(Rigidbody2D))]
public class PlayerScore : MonoBehaviour
{
    public int score = 0;
    public TMP_Text scoreText;   // Inspector에서 ScoreText(TMP) 드래그

    void Awake()
    {
        // 슬롯 안 넣어도 이름으로 자동 연결 (선택)
        if (scoreText == null)
            scoreText = GameObject.Find("ScoreText")?.GetComponent<TMP_Text>();
    }

    void Start()
    {
        // Rigidbody2D는 반드시 Dynamic or Kinematic이어야 트리거가 동작
        var rb = GetComponent<Rigidbody2D>();
        if (rb) rb.isKinematic = false; // 필요 시 true로 써도 되지만, 한쪽은 RigidBody2D 필요
        UpdateScoreUI();
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        var cv = other.GetComponent<CoinValue>();
        if (cv != null)
        {
            int gained = cv.Collect();
            if (gained > 0)
            {
                score += gained;
                UpdateScoreUI();
                Debug.Log($"[SCORE] +{gained} from {other.name} → total {score}");
            }
        }
    }

    void UpdateScoreUI()
    {
        if (scoreText) scoreText.text = $"Score: {score}";
    }
}





