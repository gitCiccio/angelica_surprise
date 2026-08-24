import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  title = 'Sorpresa per Angelica';

  // Target: August 25, 2026, 00:00:00
  targetDate = new Date('2026-08-25T00:00:00').getTime();

  // Signals for countdown
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);

  // Carousel State
  isFinished = signal(false);
  selectedImage = signal<string | null>(null);


  // List of images for the carousel
  images = [
    'images/FSZS7775[1].JPG',
    'images/GNEB7642[1].JPG',
    'images/HLUE9025[1].JPG',
    'images/HLWU8810[1].JPG',
    'images/HTKZ6974[1].JPG',
    'images/IMG_6257[1].JPG',
    'images/IMG_7285[1].JPG',
    'images/KAFJ5019[1].JPG',
    'images/NWLQ6085[1].JPG',
    'images/UOJL7178[1].JPG',
    'images/UVQF6513[1].JPG',
    'images/WENN4304[1].JPG'
  ];

  // Signal for watering the plant (0 to 100)
  waterLevel = signal(0);

  // Emojis for different stages of the plant
  private roseEmojis = ['🌱', '🌿', '🪴', '🌷', '🌹'];

  // Computed properties
  roseStageIndex = computed(() => {
    const level = this.waterLevel();
    if (level < 20) return 0;
    if (level < 40) return 1;
    if (level < 60) return 2;
    if (level < 80) return 3;
    if (level < 100) return 3;
    return 4; // fully bloomed at 100
  });

  roseEmoji = computed(() => this.roseEmojis[this.roseStageIndex()]);
  progressPercent = computed(() => `${this.waterLevel()}%`);
  canWater = computed(() => this.waterLevel() < 100);

  private intervalId: any;

  ngOnInit() {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0 || this.isFinished()) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      this.isFinished.set(true);
      return;
    }

    this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
    this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
  }

  waterPlant() {
    if (this.waterLevel() < 100) {
      this.waterLevel.update(level => Math.min(level + 10, 100));
    }
  }

  // Debug function to skip countdown
  skipCountdown() {
    this.isFinished.set(true);
  }

  selectImage(img: string) {
    this.selectedImage.set(img);
  }

  closeImage() {
    this.selectedImage.set(null);
  }
}
