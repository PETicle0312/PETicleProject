using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections;
using System.Collections.Generic;
using TMPro;

public class PlayerMove : MonoBehaviour
{
    [Header("게임 오버 UI")]
    public GameObject gameOverPanel;
    private bool isGameOver = false;
    public TMP_Text scoreText;       // HUD용
    public TMP_Text finalScoreText;  // 게임오버 화면용

    // 이미 먹은 코인 ID 저장용 (중복 점수 방지)
    private HashSet<int> collectedIds = new HashSet<int>();

    [Header("이동 및 점프")]
    public float speed = 5f;
    public float jumpForce = 10f;
    private Rigidbody2D rb;
    private Vector2 moveInput;
    private bool isGrounded;
    public LayerMask groundLayer;
    public Transform groundCheck;
    public float groundCheckRadius = 0.2f;
    private int jumpCount = 0;
    private int maxJumpCount = 2;

    [Header("점수")]
    private int score = 0;

    [Header("HP 시스템")]
    public Image fillImage;  // HPBar > Fill 연결
    public float maxHP = 6f;
    private float currentHP;

    [Header("무적 상태")]
    private bool isInvincible = false;
    public float invincibleDuration = 1f;
    private bool isBlinking = false;
    public float blinkDuration = 1.0f;
    public float blinkInterval = 0.1f;
    private SpriteRenderer spriteRenderer;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.gravityScale = 1f;
        rb.velocity = Vector2.zero;

        spriteRenderer = GetComponent<SpriteRenderer>();
        currentHP = maxHP;

        // 시작 시 패널은 꺼진 상태여야 함 (Inspector에서도 비활성화 권장)
        if (gameOverPanel) gameOverPanel.SetActive(false);

        UpdateScoreText();
        UpdateHpBar();
    }

    void Update()
    {
        if (isGameOver) return; // 게임오버 시 입력 차단

        float move = Input.GetAxisRaw("Horizontal");
        moveInput = new Vector2(move, 0);

        if (move != 0)
        {
            Vector3 s = transform.localScale;
            transform.localScale = new Vector3(Mathf.Sign(move) * Mathf.Abs(s.x), s.y, s.z);
        }

        isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundCheckRadius, groundLayer);
        if (isGrounded) jumpCount = 0;

        if (Input.GetKeyDown(KeyCode.Space) && jumpCount < maxJumpCount)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
            jumpCount++;
        }
    }

    void FixedUpdate()
    {
        if (isGameOver) return;
        rb.velocity = new Vector2(moveInput.x * speed, rb.velocity.y);
    }

    void OnTriggerEnter2D(Collider2D other)
    {
        if (isGameOver) return;

        // 코인/보너스코인 공통 처리
        if (other.CompareTag("Coin") || other.CompareTag("BonusCoin"))
        {
            // 루트 오브젝트 기준으로 ID를 잡아 한 번만 처리
            var root = other.transform.root.gameObject;
            int id = root.GetInstanceID();

            if (collectedIds.Contains(id)) return; // 이미 먹은 것
            collectedIds.Add(id);

            // 점수 계산: Coin=1, BonusCoin=3
            int pts = other.CompareTag("BonusCoin") ? 3 : 1;
            AddScore(pts);

            // 더 이상 트리거 안 일어나게 모든 콜라이더 비활성화 후 제거
            foreach (var c in root.GetComponentsInChildren<Collider2D>())
                c.enabled = false;

            Destroy(root);
            return;
        }

        // 장애물 처리 (아래는 기존 그대로)
        if (other.CompareTag("Obstacle") && !isInvincible)
        {
            TakeDamage(0.4f);
            isInvincible = true;
            StartCoroutine(BlinkRoutine());
            Invoke(nameof(ResetInvincibility), invincibleDuration);
        }
    }

    void AddScore(int pts)
    {
        score += pts;
        if (scoreText) scoreText.text = $"Score: {score}"; // HUD 갱신
    }

    void TakeDamage(float damage)
    {
        if (isGameOver) return;

        currentHP -= damage;
        currentHP = Mathf.Clamp(currentHP, 0, maxHP);
        UpdateHpBar();

        if (currentHP <= 0f)
        {
            GameOver();
        }
    }

    void GameOver()
    {
        if (isGameOver) return;
        isGameOver = true;

        if (finalScoreText) finalScoreText.text = $"Score: {score}";
        if (gameOverPanel) gameOverPanel.SetActive(true);
        Time.timeScale = 0f;
    }

    // 버튼 OnClick에 연결
    public void Retry()
    {
        Time.timeScale = 1f;
        Scene scene = SceneManager.GetActiveScene();
        SceneManager.LoadScene(scene.name);
    }

    void UpdateHpBar()
    {
        if (fillImage != null)
            fillImage.fillAmount = currentHP / maxHP;
    }

    void UpdateScoreText()
    {
        if (scoreText) scoreText.text = $"Score: {score}";
    }

    void ResetInvincibility()
    {
        isInvincible = false;
    }

    IEnumerator BlinkRoutine()
    {
        isBlinking = true;
        float elapsed = 0f;

        while (elapsed < blinkDuration)
        {
            spriteRenderer.enabled = false;
            yield return new WaitForSeconds(blinkInterval);
            spriteRenderer.enabled = true;
            yield return new WaitForSeconds(blinkInterval);
            elapsed += blinkInterval * 2f;
        }

        isBlinking = false;
    }
}
