import { QuestionService } from 'src/app/services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
  quiz_category: any;
  currentQuestionPosition = 0;
  currentquestion: any = {};
  totalScore = 0
  selectedAnswer?: any;
  selected: boolean = false;
  showScoreScreen: boolean = false
  questions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {

   }

   async ngOnInit() {
    this.quiz_category = this.route.snapshot.paramMap.get('id');
    await this.getQuestions(this.quiz_category);
  }

  async getQuestions(category: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading Questions...',
      spinner: 'crescent',
      showBackdrop: false,
      duration: 5000
    });
    loading.present();
    await this.questionService.getQuestionsByCategory(category).subscribe((data) => {
      console.log(data)
      this.questions = data;
      this.currentquestion = this.questions[this.currentQuestionPosition];
      console.log(this.currentquestion)
      loading.dismiss();
    })
  }

  score(answer: any): any {
    this.selectedAnswer = answer;
    console.log(this.selectedAnswer)
  }

  awardScore() {
    if (this.selectedAnswer.correct) {
      this.totalScore++;
      console.log(this.totalScore)
    } else {
      console.log("No score add:", this.totalScore)
    }
  }

  showSelectedAnswer() {
    this.selected = true;
  }

  //next question method catering for end and beginning of questions
  //at the end, let it show total score
  nextQuestion() {
    if (this.currentQuestionPosition < this.questions.length - 1) {
      this.currentQuestionPosition++;
      this.currentquestion = this.questions[this.currentQuestionPosition];
    } else {
      //show total score
      this.showScoreScreen = true
    }
  }

  goBack(){
    this.router.navigate(['/start']);
    this.showScoreScreen = false;
    this.currentQuestionPosition = 0;
  }
}
