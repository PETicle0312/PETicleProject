using UnityEngine;
using TMPro;

[RequireComponent(typeof(Collider2D))]
[RequireComponent(typeof(Rigidbody2D))]
public class PlayerScore : MonoBehaviour
{
    public int score = 0;
    public TMP_Text scoreText;   // Inspector���� ScoreText(TMP) �巡��

    void Awake()
    {
        // ���� �� �־ �̸����� �ڵ� ���� (����)
        if (scoreText == null)
            scoreText = GameObject.Find("ScoreText")?.GetComponent<TMP_Text>();
    }

    void Start()
    {
        // Rigidbody2D�� �ݵ�� Dynamic or Kinematic�̾�� Ʈ���Ű� ����
        var rb = GetComponent<Rigidbody2D>();
        if (rb) rb.isKinematic = false; // �ʿ� �� true�� �ᵵ ������, ������ RigidBody2D �ʿ�
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
                Debug.Log($"[SCORE] +{gained} from {other.name} �� total {score}");
            }
        }
    }

    void UpdateScoreUI()
    {
        if (scoreText) scoreText.text = $"Score: {score}";
    }
}





