import { useState } from 'react';
import styles from './App.module.css';

const WIN_URL = 'https://github.com/namgi2386/seorat/releases/download/v1.0.0/pocket-seorin-win.zip';

const FEATURES = [
  { icon: '🖥️', text: '데스크탑 위에 항상 최상위로 표시 — 어떤 창을 열어도 사라지지 않음' },
  { icon: '🎭', text: '5가지 애니메이션 랜덤 재생 — 동의, 복싱, 달리기, 포효, 걷기' },
  { icon: '🖱️', text: '마우스로 원하는 위치로 자유롭게 이동' },
  { icon: '⚡', text: '앱 실행 즉시 캐릭터 등장 — 별도 설정 불필요' },
  { icon: '🪟', text: '투명 배경 — 캐릭터만 화면에 표시' },
];

export default function App() {
  const [winOpen, setWinOpen] = useState(false);
  const [macOpen, setMacOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.subtitle}>당신의 데스크탑 위에 항상 함께</p>
        <h1 className={styles.title}>pocket seorin</h1>
        <p className={styles.desc}>
          항상 최상위로 떠있는 3D 캐릭터 오버레이 앱
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.screenshotPlaceholder}>
          <span>스크린샷 준비 중</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>기능</h2>
        <ul className={styles.featureList}>
          {FEATURES.map((f, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>다운로드</h2>
        <div className={styles.downloadRow}>
          <a href={WIN_URL} className={styles.downloadBtn} download>
            <span className={styles.btnIcon}>🪟</span>
            <span>
              <strong>Windows</strong>
              <small>zip 압축 해제 후 실행</small>
            </span>
          </a>
          <button className={`${styles.downloadBtn} ${styles.disabled}`} disabled>
            <span className={styles.btnIcon}>🍎</span>
            <span>
              <strong>macOS</strong>
              <small>준비 중</small>
            </span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>설치 방법</h2>
        <div className={styles.guide}>
          <h3>Windows</h3>
          <ol>
            <li>위 버튼을 눌러 zip 파일을 다운로드합니다.</li>
            <li>zip 파일의 압축을 해제합니다.</li>
            <li><code>pocket seorin.exe</code>를 실행합니다.</li>
          </ol>

          <button
            className={styles.toggleBtn}
            onClick={() => setWinOpen(v => !v)}
          >
            {winOpen ? '▲' : '▼'} &nbsp;
            "Windows에서 PC를 보호했습니다" 경고가 뜨는 경우
          </button>
          {winOpen && (
            <div className={styles.toggleContent}>
              <p>앱이 코드 서명되지 않아 SmartScreen 경고가 표시됩니다. 아래 순서로 실행하세요.</p>
              <ol>
                <li>경고 창에서 <strong>"추가 정보"</strong> 클릭</li>
                <li><strong>"실행"</strong> 버튼 클릭</li>
              </ol>
            </div>
          )}

          <h3 style={{ marginTop: '2rem' }}>macOS <small style={{ fontWeight: 400, opacity: 0.5 }}>(준비 중)</small></h3>
          <button
            className={styles.toggleBtn}
            onClick={() => setMacOpen(v => !v)}
          >
            {macOpen ? '▲' : '▼'} &nbsp;
            "개발자를 확인할 수 없음" 경고가 뜨는 경우
          </button>
          {macOpen && (
            <div className={styles.toggleContent}>
              <p>Gatekeeper 보안 정책으로 인해 경고가 표시됩니다. 아래 순서로 실행하세요.</p>
              <ol>
                <li>앱 파일을 <strong>우클릭 → 열기</strong> 선택</li>
                <li>경고 창에서 <strong>"열기"</strong> 클릭</li>
                <li>이후에는 일반적으로 실행 가능합니다.</li>
              </ol>
            </div>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 pocket seorin</p>
      </footer>
    </div>
  );
}
